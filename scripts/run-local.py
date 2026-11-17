#!/usr/bin/env python3
"""Prepare the local PawPair backend, then run both apps."""

from __future__ import annotations

import json
import hashlib
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
NETWORK = "pawpair-local"
BINDING_OPTION = "com.docker.network.bridge.host_binding_ipv4"


def require_command(name: str) -> None:
    if shutil.which(name) is None:
        raise RuntimeError(f"{name} is required for local startup")


def ensure_network(network: str) -> None:
    docker = subprocess.run(
        ["docker", "info"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    if docker.returncode != 0:
        raise RuntimeError("Docker is not running")

    result = subprocess.run(
        ["docker", "network", "inspect", network],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        subprocess.run(
            ["docker", "network", "create", "-o", f"{BINDING_OPTION}=127.0.0.1", network],
            check=True,
            stdout=subprocess.DEVNULL,
        )
        return

    networks = json.loads(result.stdout)
    if len(networks) != 1 or networks[0].get("Options", {}).get(BINDING_OPTION) != "127.0.0.1":
        raise RuntimeError(f"Docker network {network} must bind published ports to 127.0.0.1")


def active_selection() -> dict | None:
    active_path = ROOT / ".project/active.json"
    if not active_path.is_file():
        return None
    active = json.loads(active_path.read_text())
    structure = (ROOT / "PROJECT_STRUCTURE.md").read_text()
    blocks = re.findall(r"```project-init\s*\n(.*?)\n```", structure, re.DOTALL)
    if len(blocks) != 1 or hashlib.sha256(blocks[0].encode()).hexdigest() != active.get("structureDigest"):
        raise RuntimeError("PROJECT_STRUCTURE.md changed; run pnpm project:init again")
    if active.get("database") not in {"none", "supabase"}:
        raise RuntimeError("Invalid active project database configuration")
    if active["database"] == "supabase" and not isinstance(active.get("network"), str):
        raise RuntimeError("Missing client Supabase network; run pnpm project:init again")
    return active


def prepare_backend(*, reference: bool, network: str) -> None:
    for command in ("docker", "supabase", "pnpm"):
        require_command(command)
    ensure_network(network)

    print("Starting local Supabase (or reusing the running stack)...", flush=True)
    started = subprocess.run(
        ["supabase", "start", "--network-id", network],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if started.returncode != 0:
        raise RuntimeError("Supabase could not start; check Docker and the local ports")

    subprocess.run([sys.executable, str(ROOT / "scripts/configure-local-supabase.py")], cwd=ROOT, check=True)
    if reference:
        subprocess.run(["pnpm", "--filter", "@fe-template/db", "db:deploy"], cwd=ROOT, check=True)
        subprocess.run(["pnpm", "--filter", "@fe-template/db", "db:seed"], cwd=ROOT, check=True)


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in {"dev", "start"}:
        raise RuntimeError("usage: run-local.py dev|start")
    mode = sys.argv[1]
    active = active_selection()
    if active is None:
        prepare_backend(reference=True, network=NETWORK)
    elif active["database"] == "supabase":
        prepare_backend(reference=False, network=active["network"])
    else:
        print("No database selected; starting apps without Docker.", flush=True)
    if mode == "start":
        subprocess.run(["pnpm", "exec", "turbo", "run", "build", "--force"], cwd=ROOT, check=True)
    os.chdir(ROOT)
    os.execvp("pnpm", ["pnpm", "exec", "turbo", "run", mode])


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError, RuntimeError) as error:
        if isinstance(error, subprocess.CalledProcessError):
            raise SystemExit(f"Local startup stopped: {error.cmd[0]} exited with status {error.returncode}") from error
        raise SystemExit(f"Local startup stopped: {error}") from error
