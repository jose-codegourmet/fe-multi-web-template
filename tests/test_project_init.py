"""Validate client workspace selection without touching the PawPair checkout."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import tempfile
import tomllib
import unittest

ROOT = Path(__file__).resolve().parent.parent


def load_script(name: str):
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), ROOT / "scripts" / name)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


initializer = load_script("project-init.py")
runner = load_script("run-local.py")


class ProjectInitTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / "docs/project").mkdir(parents=True)
        (self.root / "docs/project/brief.md").write_text(
            "# Test brief\n- Status: confirmed\n- Revision: R1\n"
            "- Confirmation evidence: user approved R1 on 2026-11-17\n"
            "- Client and project name: Test Project\n"
            "- Product/service and goals: Example app for testing\n"
            "- Intended users and roles: Test users\n"
            "- Selected deliverables: Landing and mockapp\n"
        )
        (self.root / "pnpm-workspace.yaml").write_text(
            'packages:\n  - "apps/*"\n  - "packages/*"\n\nallowBuilds:\n  prisma: true\n'
        )
        (self.root / "supabase").mkdir()
        (self.root / "supabase/config.toml").write_text((ROOT / "supabase/config.toml").read_text())
        self.plan = {
            "schemaVersion": 1,
            "projectName": "Test Project",
            "briefRevision": "R1",
            "apps": [
                {"id": "landing", "kind": "landing", "port": 9000, "dataMode": "static", "routes": ["/"]},
                {"id": "mockapp", "kind": "mockapp", "port": 9001, "dataMode": "mock", "routes": ["/", "/prototype"]},
            ],
            "database": {"kind": "none", "reason": "No persistent data is needed"},
        }
        self.save_plan()

    def save_plan(self):
        (self.root / "PROJECT_STRUCTURE.md").write_text(
            "# Test structure\n\n```project-init\n"
            + json.dumps(self.plan, indent=2)
            + "\n```\n"
        )

    def test_landing_and_mockapp_exclude_database(self):
        plan, digest = initializer.load_plan(self.root)
        initializer.initialize(self.root, plan, digest, install=False)
        workspace = (self.root / "pnpm-workspace.yaml").read_text()
        self.assertIn('"apps/landing"', workspace)
        self.assertIn('"apps/mockapp"', workspace)
        self.assertNotIn("packages/db", workspace)
        self.assertNotIn('"apps/*"', workspace)
        self.assertTrue((self.root / "apps/landing/src/app/page.tsx").is_file())
        self.assertTrue((self.root / "apps/mockapp/package.json").is_file())
        original = runner.ROOT
        runner.ROOT = self.root
        try:
            self.assertEqual(runner.active_selection()["database"], "none")
            self.save_plan()
            self.plan["projectName"] = "Changed without reinit"
            self.save_plan()
            with self.assertRaisesRegex(RuntimeError, "project:init again"):
                runner.active_selection()
        finally:
            runner.ROOT = original

    def test_database_selection_adds_package_without_running_reference_migrations(self):
        self.plan["apps"][1]["dataMode"] = "database"
        self.plan["apps"][1]["kind"] = "customer"
        self.plan["database"] = {"kind": "supabase", "reason": "Customer profiles need persistence"}
        self.save_plan()
        plan, digest = initializer.load_plan(self.root)
        initializer.initialize(self.root, plan, digest, install=False)
        self.assertIn('"packages/db"', (self.root / "pnpm-workspace.yaml").read_text())
        active = json.loads((self.root / ".project/active.json").read_text())
        self.assertEqual(active["database"], "supabase")
        self.assertNotEqual(active["network"], "pawpair-local")
        config = (self.root / "supabase/config.toml").read_text()
        self.assertNotIn('project_id = "fe-multi-web-template"', config)
        self.assertNotIn("port = 55321", config)
        parsed = tomllib.loads(config)
        self.assertEqual(parsed["api"]["port"] + 1, parsed["db"]["port"])
        self.assertEqual(parsed["api"]["port"] + 2, parsed["studio"]["port"])

    def test_unconfirmed_brief_and_database_mismatch_are_rejected(self):
        (self.root / "docs/project/brief.md").write_text("- Status: draft\n- Revision: R1\n- Confirmation evidence: TBD\n")
        with self.assertRaises(ValueError):
            initializer.load_plan(self.root)
        (self.root / "docs/project/brief.md").write_text(
            "- Status: confirmed\n- Revision: R1\n- Confirmation evidence: approved R1\n"
            "- Client and project name: Test Project\n"
            "- Product/service and goals: Example app\n"
            "- Intended users and roles: Test users\n"
            "- Selected deliverables: Landing and mockapp\n"
        )
        self.plan["apps"][0]["dataMode"] = "database"
        self.save_plan()
        with self.assertRaisesRegex(ValueError, "database.kind is none"):
            initializer.load_plan(self.root)

    def test_existing_reference_app_is_never_overwritten(self):
        self.plan["apps"][0]["id"] = "web"
        self.save_plan()
        (self.root / "apps/web").mkdir(parents=True)
        plan, digest = initializer.load_plan(self.root)
        with self.assertRaisesRegex(ValueError, "already exists"):
            initializer.initialize(self.root, plan, digest, install=False)
        self.assertIn('"apps/*"', (self.root / "pnpm-workspace.yaml").read_text())
        self.assertFalse((self.root / ".project/active.json").exists())

    def test_pristine_generated_shell_can_follow_revised_plan(self):
        plan, digest = initializer.load_plan(self.root)
        initializer.initialize(self.root, plan, digest, install=False)
        self.plan["apps"][0]["port"] = 9200
        self.save_plan()
        plan, digest = initializer.load_plan(self.root)
        initializer.initialize(self.root, plan, digest, install=False)
        package = json.loads((self.root / "apps/landing/package.json").read_text())
        self.assertEqual(package["scripts"]["dev"], "next dev -p 9200")
        (self.root / "apps/landing/src/app/page.tsx").write_text("custom implementation")
        self.plan["apps"][0]["port"] = 9300
        self.save_plan()
        plan, digest = initializer.load_plan(self.root)
        with self.assertRaisesRegex(ValueError, "has edits"):
            initializer.initialize(self.root, plan, digest, install=False)


if __name__ == "__main__":
    unittest.main()
