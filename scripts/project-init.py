#!/usr/bin/env python3
"""Activate only the workspaces in a confirmed PROJECT_STRUCTURE.md."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
KINDS = {"landing", "mockapp", "admin", "customer", "custom"}
DATA_MODES = {"static", "mock", "database", "external"}
SLUG = re.compile(r"^[a-z][a-z0-9-]*$")


def field(text: str, name: str) -> str:
    match = re.search(rf"^- {re.escape(name)}: (.+)$", text, re.MULTILINE)
    value = match.group(1).strip() if match else ""
    if not value or value.lower() in {"tbd", "none", "draft", "placeholder"}:
        raise ValueError(f"docs/project/brief.md needs a real '{name}' value")
    return value


def load_plan(root: Path) -> tuple[dict, str]:
    brief_path = root / "docs/project/brief.md"
    structure_path = root / "PROJECT_STRUCTURE.md"
    if not brief_path.is_file() or not structure_path.is_file():
        raise ValueError("Create and confirm docs/project/brief.md, then create PROJECT_STRUCTURE.md")

    brief = brief_path.read_text()
    if field(brief, "Status").lower() != "confirmed":
        raise ValueError("The saved client brief must have Status: confirmed")
    revision = field(brief, "Revision")
    field(brief, "Confirmation evidence")
    for answer in (
        "Client and project name",
        "Product/service and goals",
        "Intended users and roles",
        "Selected deliverables",
    ):
        field(brief, answer)

    structure = structure_path.read_text()
    blocks = re.findall(r"```project-init\s*\n(.*?)\n```", structure, re.DOTALL)
    if len(blocks) != 1:
        raise ValueError("PROJECT_STRUCTURE.md needs exactly one project-init JSON block")
    plan = json.loads(blocks[0])
    if not isinstance(plan, dict) or plan.get("schemaVersion") != 1:
        raise ValueError("Unsupported project structure schemaVersion")
    if plan.get("briefRevision") != revision:
        raise ValueError("PROJECT_STRUCTURE.md must match the confirmed brief revision")
    name = plan.get("projectName")
    if not isinstance(name, str) or not name.strip() or name.lower() in {"tbd", "example project"}:
        raise ValueError("projectName is required")

    database = plan.get("database")
    if not isinstance(database, dict) or database.get("kind") not in {"none", "supabase"}:
        raise ValueError("database.kind must be 'none' or 'supabase'")
    if not isinstance(database.get("reason"), str) or not database["reason"].strip():
        raise ValueError("database.reason is required")

    apps = plan.get("apps")
    if not isinstance(apps, list) or not apps:
        raise ValueError("Select at least one app")
    ids: set[str] = set()
    ports: set[int] = set()
    database_users = 0
    for app in apps:
        if not isinstance(app, dict):
            raise ValueError("Each app must be an object")
        app_id, kind, port, data_mode = (app.get(key) for key in ("id", "kind", "port", "dataMode"))
        if not isinstance(app_id, str) or not SLUG.fullmatch(app_id) or app_id in ids:
            raise ValueError("App ids must be unique lowercase slugs")
        if kind not in KINDS or data_mode not in DATA_MODES:
            raise ValueError(f"Invalid kind or dataMode for {app_id}")
        if type(port) is not int or not 1024 <= port <= 65535 or port in ports:
            raise ValueError(f"{app_id} needs a unique port from 1024 to 65535")
        if kind == "mockapp" and data_mode != "mock":
            raise ValueError(f"{app_id}: mockapp must use mock data")
        if data_mode == "database":
            database_users += 1
        routes = app.get("routes")
        if not isinstance(routes, list) or not routes or any(
            not isinstance(route, str) or not route.startswith("/") for route in routes
        ):
            raise ValueError(f"{app_id} needs a list of routes beginning with /")
        ids.add(app_id)
        ports.add(port)
    if database["kind"] == "none" and database_users:
        raise ValueError("An app needs database data, but database.kind is none")
    if database["kind"] == "supabase" and not database_users:
        raise ValueError("Supabase was selected without an app that needs database data")

    digest = hashlib.sha256(blocks[0].encode()).hexdigest()
    return plan, digest


def app_files(project: str, app: dict) -> dict[str, str]:
    app_id, kind, port = app["id"], app["kind"], app["port"]
    title = f"{project} — {kind.title()}"
    package = {
        "name": app_id,
        "version": "0.1.0",
        "private": True,
        "scripts": {
            "dev": f"next dev -p {port}",
            "build": "next build",
            "start": f"next start -p {port}",
            "typecheck": "tsc --noEmit",
        },
        "dependencies": {"next": "16.4.6", "react": "19.2.4", "react-dom": "19.2.4"},
        "devDependencies": {
            "@types/node": "^22",
            "@types/react": "^19",
            "@types/react-dom": "^19",
            "typescript": "^5",
        },
    }
    return {
        ".project-init.json": json.dumps({"projectName": project, **app}, indent=2) + "\n",
        "package.json": json.dumps(package, indent=2) + "\n",
        "next.config.ts": 'import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\nexport default nextConfig;\n',
        "tsconfig.json": json.dumps({"compilerOptions": {"target": "ES2017", "lib": ["dom", "dom.iterable", "esnext"], "allowJs": True, "skipLibCheck": True, "strict": True, "noEmit": True, "esModuleInterop": True, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": True, "isolatedModules": True, "jsx": "react-jsx", "incremental": True, "plugins": [{"name": "next"}]}, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"]}, indent=2) + "\n",
        "next-env.d.ts": '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
        "src/app/globals.css": "body { margin: 0; font-family: Arial, sans-serif; color: #171717; background: #faf9f6; }\nmain { max-width: 72rem; margin: 0 auto; padding: 4rem 1.5rem; }\n",
        "src/app/layout.tsx": f'import type {{ Metadata }} from "next";\nimport type {{ ReactNode }} from "react";\nimport "./globals.css";\n\nexport const metadata: Metadata = {{ title: {json.dumps(title)} }};\n\nexport default function RootLayout({{ children }}: Readonly<{{ children: ReactNode }}>) {{\n  return <html lang="en"><body>{{children}}</body></html>;\n}}\n',
        "src/app/page.tsx": f'export default function HomePage() {{\n  return <main><h1>{{{json.dumps(title)}}}</h1><p>Build this {kind} from the confirmed client brief and PROJECT_STRUCTURE.md.</p></main>;\n}}\n',
        "AGENTS.md": f"# {app_id}\n\nRead root `TODO.md`, `AGENTS.md`, the confirmed `docs/project/brief.md`, and `PROJECT_STRUCTURE.md` before changing this app. This is the {kind} workspace on port {port}. Implement only its selected routes and {app['dataMode']} data behavior.\n",
        "docs/README.md": f"# {app_id}\n\n{kind.title()} app for {project}. Port: {port}. Data mode: {app['dataMode']}. Planned routes: {', '.join(app['routes'])}. See root `PROJECT_STRUCTURE.md` and the confirmed brief for requirements.\n",
    }


def workspace_text(original: str, app_ids: list[str], with_db: bool) -> str:
    lines = original.splitlines()
    if not lines or lines[0] != "packages:":
        raise ValueError("pnpm-workspace.yaml must start with packages:")
    end = next((index for index, line in enumerate(lines[1:], 1) if line and not line.startswith(" ") and not line.startswith("#")), len(lines))
    selected = [f'  - "apps/{app_id}"' for app_id in app_ids]
    if with_db:
        selected.append('  - "packages/db"')
    return "\n".join(["packages:", *selected, "", *lines[end:]]).rstrip() + "\n"


def supabase_config(original: str, plan: dict) -> tuple[str, str]:
    project = plan["projectName"]
    slug = re.sub(r"[^a-z0-9]+", "-", project.lower()).strip("-")[:30] or "client"
    suffix = hashlib.sha256(project.lower().encode()).hexdigest()[:6]
    project_id = f"{slug}-{suffix}"
    base = 57000 + (int(suffix, 16) % 100) * 20
    ports = {
        ("api", "port"): base + 1,
        ("db", "port"): base + 2,
        ("db", "shadow_port"): base,
        ("db.pooler", "port"): base + 9,
        ("studio", "port"): base + 3,
        ("inbucket", "port"): base + 4,
        ("edge_runtime", "inspector_port"): base + 5,
        ("analytics", "port"): base + 7,
    }
    auth_app = next((app for app in plan["apps"] if app["kind"] == "admin"), plan["apps"][0])
    section = ""
    found: set[tuple[str, str]] = set()
    lines = []
    for line in original.splitlines():
        match = re.match(r"^\[([^]]+)\]$", line)
        if match:
            section = match.group(1)
        if not line.lstrip().startswith("#"):
            key = line.split("=", 1)[0].strip() if "=" in line else ""
            if not section and key == "project_id":
                line = f'project_id = "{project_id}"'
                found.add(("", "project_id"))
            elif (section, key) in ports:
                line = f"{key} = {ports[(section, key)]}"
                found.add((section, key))
            elif section == "auth" and key == "site_url":
                line = f'site_url = "http://localhost:{auth_app["port"]}"'
                found.add(("auth", "site_url"))
            elif section == "auth" and key == "additional_redirect_urls":
                port = auth_app["port"]
                line = f'additional_redirect_urls = ["http://localhost:{port}/**", "http://127.0.0.1:{port}/**"]'
                found.add(("auth", "additional_redirect_urls"))
        lines.append(line)
    expected = set(ports) | {
        ("", "project_id"),
        ("auth", "site_url"),
        ("auth", "additional_redirect_urls"),
    }
    if found != expected:
        raise ValueError("supabase/config.toml lacks a required local port or auth setting")
    return "\n".join(lines) + "\n", f"{project_id}-local"


def initialize(root: Path, plan: dict, digest: str, *, dry_run: bool = False, install: bool = True) -> None:
    apps = plan["apps"]
    actions: dict[str, str] = {}
    for app in apps:
        directory = root / "apps" / app["id"]
        if not directory.exists():
            actions[app["id"]] = "create"
            continue
        marker = directory / ".project-init.json"
        if not marker.is_file():
            raise ValueError(f"{directory} already exists; choose another id or adapt it manually")
        previous = json.loads(marker.read_text())
        if previous == {"projectName": plan["projectName"], **app}:
            actions[app["id"]] = "keep"
            continue
        old_project = previous.pop("projectName", None)
        if not isinstance(old_project, str) or previous.get("id") != app["id"] or not {"kind", "port", "dataMode", "routes"}.issubset(previous):
            raise ValueError(f"{directory} has an invalid initializer marker")
        old_files = app_files(old_project, previous)
        if any(not (directory / relative).is_file() or (directory / relative).read_text() != content for relative, content in old_files.items()):
            raise ValueError(f"{directory} has edits; update it manually before changing its plan")
        actions[app["id"]] = "refresh"

    workspace = root / "pnpm-workspace.yaml"
    with_db = plan["database"]["kind"] != "none"
    updated_workspace = workspace_text(workspace.read_text(), [app["id"] for app in apps], with_db)
    config_path = root / "supabase/config.toml"
    updated_config, network = supabase_config(config_path.read_text(), plan) if with_db else (None, None)
    print(f"Project: {plan['projectName']}")
    print("Active apps: " + ", ".join(f"{app['id']} ({app['kind']}, :{app['port']})" for app in apps))
    print("Database: " + plan["database"]["kind"])
    if dry_run:
        print("Dry run: no files changed")
        return

    for app in apps:
        directory = root / "apps" / app["id"]
        if actions[app["id"]] == "keep":
            continue
        for relative, content in app_files(plan["projectName"], app).items():
            target = directory / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)

    workspace.write_text(updated_workspace)
    if updated_config is not None:
        config_path.write_text(updated_config)
    active = root / ".project" / "active.json"
    active.parent.mkdir(exist_ok=True)
    active.write_text(json.dumps({"schemaVersion": 1, "structureDigest": digest, "briefRevision": plan["briefRevision"], "apps": [app["id"] for app in apps], "database": plan["database"]["kind"], "network": network}, indent=2) + "\n")
    if install:
        subprocess.run(["pnpm", "install"], cwd=root, check=True)
    print("Project workspaces initialized. Implement the planned routes and data model next.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Validate and show the selection without changing files")
    args = parser.parse_args()
    plan, digest = load_plan(ROOT)
    initialize(ROOT, plan, digest, dry_run=args.dry_run)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, json.JSONDecodeError, subprocess.CalledProcessError) as error:
        raise SystemExit(f"project:init stopped: {error}") from error
