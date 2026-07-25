#!/usr/bin/env python3
"""
Remove unused component folders from apps/web after copying this template.

Usage:
  python scripts/cleanup-unused.py           # dry-run (default)
  python scripts/cleanup-unused.py --delete  # delete unused folders
  python scripts/cleanup-unused.py --help
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB_COMPONENTS = ROOT / "apps/web/src/components"
SCAN_ROOTS = [
    ROOT / "apps/web/src/app",
    ROOT / "apps/web/src/components",
    ROOT / "apps/web/src/hooks",
    ROOT / "apps/web/src/store",
]

# Matches import/export ... from "..." (alias and relative paths)
IMPORT_RE = re.compile(r"""\bfrom\s+["']([^"']+)["']""")

SKIP_DIR_NAMES = {"node_modules", ".git", "dist", ".next"}


def is_component_tsx(path: Path) -> bool:
    """True for primary component files (excludes stories)."""
    if path.suffix != ".tsx":
        return False
    if path.name.endswith(".stories.tsx"):
        return False
    # Must look like a PascalCase component file
    stem = path.stem
    return bool(stem) and stem[0].isupper()


def find_component_folders(root: Path) -> list[Path]:
    """
    Find folders that contain a primary *.tsx component file.

    Examples:
      button/Button.tsx
      sections/home/hero/HeroSection.tsx
      motion/scroll-reveal/ScrollReveal.tsx
    """
    if not root.is_dir():
        return []

    folders: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
        current = Path(dirpath)
        for name in filenames:
            if is_component_tsx(current / name):
                # Any primary component .tsx qualifies (Button.tsx, HeroSection.tsx, etc.)
                folders.append(current)
                break
    return sorted(set(folders))


def iter_source_files(scan_roots: list[Path]) -> list[Path]:
    files: list[Path] = []
    for scan_root in scan_roots:
        if not scan_root.is_dir():
            continue
        for dirpath, dirnames, filenames in os.walk(scan_root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
            current = Path(dirpath)
            for name in filenames:
                if name.endswith((".ts", ".tsx")):
                    files.append(current / name)
    return files


def resolve_import(source_file: Path, spec: str) -> Path | None:
    """
    Resolve an import specifier to a filesystem path under WEB_COMPONENTS when possible.
    Returns a path that may be a file or directory (caller normalizes to folder).
    """
    if spec.startswith("@/components/"):
        rel = spec[len("@/components/") :]
        return (WEB_COMPONENTS / rel).resolve()

    if spec.startswith("./") or spec.startswith("../"):
        resolved = (source_file.parent / spec).resolve()
        # Only care about imports that land under components/
        try:
            resolved.relative_to(WEB_COMPONENTS.resolve())
        except ValueError:
            return None
        return resolved

    return None


def normalize_to_file_or_dir(path: Path) -> Path | None:
    """If import omits extension, try common TS/TSX/index resolutions."""
    if path.exists():
        return path

    for ext in (".tsx", ".ts", ".jsx", ".js"):
        candidate = Path(str(path) + ext)
        if candidate.exists():
            return candidate

    for index_name in ("index.tsx", "index.ts", "index.jsx", "index.js"):
        candidate = path / index_name
        if candidate.exists():
            return candidate

    return None


def collect_used_folders(scan_roots: list[Path], component_folders: list[Path]) -> set[Path]:
    """
    Return component folders that are imported from outside themselves.

    Self-imports (e.g. Button.stories.tsx → ./Button) do not count as usage,
    but imports from other stories/pages/components do — so Storybook-only
    cross-usage keeps a component alive.
    """
    folder_set = {f.resolve() for f in component_folders}
    used: set[Path] = set()
    source_files = iter_source_files(scan_roots)

    for source in source_files:
        try:
            text = source.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue

        source_resolved = source.resolve()
        for match in IMPORT_RE.finditer(text):
            spec = match.group(1)
            # Skip side-effect CSS and non-path imports
            if not (
                spec.startswith("@/components/")
                or spec.startswith("./")
                or spec.startswith("../")
            ):
                continue

            target = resolve_import(source, spec)
            if target is None:
                continue

            normalized = normalize_to_file_or_dir(target)
            check_path = normalized if normalized is not None else target

            # Map target to owning component folder (longest matching prefix)
            owning: Path | None = None
            for folder in folder_set:
                try:
                    check_path.relative_to(folder)
                except ValueError:
                    continue
                if owning is None or len(folder.parts) > len(owning.parts):
                    owning = folder

            if owning is None:
                continue

            # Ignore self-references from inside the same component folder
            try:
                source_resolved.relative_to(owning)
                continue
            except ValueError:
                pass

            used.add(owning)

    return used


def folder_display(folder: Path) -> str:
    try:
        return str(folder.relative_to(ROOT)) + "/"
    except ValueError:
        return str(folder) + "/"


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Detect (and optionally delete) unused component folders "
            "under apps/web/src/components."
        )
    )
    parser.add_argument(
        "--delete",
        action="store_true",
        help="Permanently delete unused folders (default is dry-run)",
    )
    args = parser.parse_args()

    if not WEB_COMPONENTS.is_dir():
        print(f"Components directory not found: {WEB_COMPONENTS}")
        return 1

    component_folders = find_component_folders(WEB_COMPONENTS)
    used = collect_used_folders(SCAN_ROOTS, component_folders)
    unused = sorted(
        (f for f in component_folders if f.resolve() not in used),
        key=lambda p: str(p),
    )

    if not unused:
        print("No unused component folders found.")
        return 0

    if args.delete:
        print(f"Deleting {len(unused)} unused folder(s):")
        for folder in unused:
            display = folder_display(folder)
            shutil.rmtree(folder)
            print(f"  deleted {display}")
        print(f"\nRemoved {len(unused)} folder(s).")
        return 0

    print("Unused component folders (dry-run):")
    for folder in unused:
        print(f"  {folder_display(folder)}")
    print(f"\n{len(unused)} unused folder(s) found. Run with --delete to remove.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
