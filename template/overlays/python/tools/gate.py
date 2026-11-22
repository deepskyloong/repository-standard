from __future__ import annotations

import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(*command: str) -> None:
    print("+", " ".join(command))
    subprocess.run(command, cwd=ROOT, check=True)


def main() -> int:
    config = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    run("ruff", "format", "--check", "src", "tests", "tools")
    run("ruff", "check", "src", "tests", "tools")
    if shutil.which("pyright"):
        run("pyright", "src", "tests")
    run("pytest", "-q")
    if "build-system" in config:
        run(sys.executable, "-m", "build")
    run(sys.executable, "tools/check_tables.py")
    run(sys.executable, "tools/check_messages.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
