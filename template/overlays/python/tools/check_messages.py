"""The message-catalog stage (`docs/norm/code/messages.md`): holds the shape of a catalog.

Usage:
    uv run python tools/check_messages.py

The repository declares its catalog in `pyproject.toml`:

    [tool.messages]
    module = "example_package.messages"

The module exposes `SPECS`, a mapping from a code to a spec that carries a
`template` string and a `params` sequence, and may export `PARTS`, the pieces it
merged. Fails a code that does not name a domain, a template whose placeholders
and declared params differ, a positional placeholder, two codes sharing one
wording, a literal number outside a placeholder, and a code a merge overwrote. A
code whose wording legitimately carries a number is listed under
`[tool.messages] exempt`. A repository that declares no catalog passes.

Exit codes: 0 every catalog holds the shape; 1 at least one finding.
"""

from __future__ import annotations

import importlib
import re
import string
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAMESPACED = re.compile(r"^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$")


def declared_module() -> str | None:
    """The catalog module `pyproject.toml` names, or None when it names none."""
    config = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    section = config.get("tool", {}).get("messages")
    if not isinstance(section, dict):
        return None
    name = section.get("module")
    return name if isinstance(name, str) else None


def declared_exempt() -> set[str]:
    """Codes whose template may carry a literal number."""
    config = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    section = config.get("tool", {}).get("messages")
    if not isinstance(section, dict):
        return set()
    codes = section.get("exempt")
    if not isinstance(codes, (list, tuple)):
        return set()
    return {code for code in codes if isinstance(code, str)}


def literal_number(template: str) -> str | None:
    """The first digit outside a placeholder, with the word it belongs to."""
    without_fields = re.sub(r"\{[^{}]*\}", " ", template)
    match = re.search(r"\S*\d\S*", without_fields)
    return match.group(0) if match else None


def placeholders(template: str) -> tuple[set[str], list[str]]:
    """The parameter names the template formats with, and any positional placeholders."""
    names: set[str] = set()
    positional: list[str] = []
    for _, field, _, _ in string.Formatter().parse(template):
        if field is None:
            continue
        if field == "":
            positional.append("{}")
            continue
        base = re.split(r"[.\[]", field, maxsplit=1)[0]
        if base.isidentifier():
            names.add(base)
        else:
            positional.append("{" + field + "}")
    return names, positional


def declared_params(spec: object) -> tuple[str, set[str]] | None:
    """The spec's template and param names, or None when the spec is malformed."""
    template = getattr(spec, "template", None)
    params = getattr(spec, "params", None)
    if not isinstance(template, str) or not isinstance(params, (tuple, list, set, frozenset)):
        return None
    names = set(params)
    if not all(isinstance(name, str) for name in names):
        return None
    return template, names


def findings_in_catalog(module: str, specs: dict[str, object], exempt: set[str]) -> list[str]:
    """Every shape finding in one catalog, as `messages.<kind>: module: detail`."""
    findings: list[str] = []
    wordings: dict[str, list[str]] = {}
    for code, spec in specs.items():
        if not NAMESPACED.match(code):
            findings.append(f"messages.unnamespaced: {module}: {code!r} does not name a domain")
        shape = declared_params(spec)
        if shape is None:
            findings.append(
                f"messages.spec: {module}: {code!r} needs a template string and a params sequence"
            )
            continue
        template, names = shape
        try:
            used, positional = placeholders(template)
        except ValueError as error:
            findings.append(f"messages.template: {module}: {code!r} cannot format: {error}")
            continue
        if positional:
            findings.append(
                f"messages.template: {module}: {code!r} has positional placeholders: "
                + ", ".join(positional)
            )
        if used != names:
            detail: list[str] = []
            if used - names:
                detail.append(f"template reads {', '.join(sorted(used - names))}")
            if names - used:
                detail.append(f"params declares {', '.join(sorted(names - used))}")
            findings.append(
                f"messages.shape: {module}: {code!r} placeholders and params differ: "
                + "; ".join(detail)
            )
        wordings.setdefault(" ".join(template.split()), []).append(code)
        fragment = literal_number(template)
        if fragment is not None and code not in exempt:
            findings.append(
                f"messages.digit: {module}: {code!r} types {fragment!r} into its template"
            )
    for wording, codes in wordings.items():
        if len(codes) > 1:
            findings.append(
                f"messages.duplicate: {module}: {', '.join(codes)} share one wording: {wording!r}"
            )
    return findings


def main() -> int:
    module = declared_module()
    if module is None:
        print("check_messages: no catalog declared")
        return 0
    try:
        catalog = importlib.import_module(module)
    except Exception as error:
        print(f"messages.unloadable: {module}: {error}")
        print("check_messages: 0 code(s), 1 finding(s)")
        return 1
    specs = getattr(catalog, "SPECS", None)
    if not isinstance(specs, dict):
        print(f"messages.catalog: {module}: the module exposes no SPECS mapping")
        print("check_messages: 0 code(s), 1 finding(s)")
        return 1
    findings = findings_in_catalog(module, specs, declared_exempt())
    parts = getattr(catalog, "PARTS", None)
    if isinstance(parts, (tuple, list)):
        merged = sum(len(part) for part in parts if isinstance(part, dict))
        if merged != len(specs):
            findings.insert(
                0,
                f"messages.collision: {module}: {len(specs)} codes survived a merge of {merged}; "
                "a duplicate key was overwritten",
            )
    for finding in findings:
        print(finding)
    print(f"check_messages: {len(specs)} code(s), {len(findings)} finding(s)")
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
