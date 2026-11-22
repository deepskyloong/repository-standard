# Norm — the repository standard

The binding text of the repository standard. Read by question, not in order.

| Page | Question it answers |
| --- | --- |
| [foundations](foundations.md) | What the standard is, which principles bind it, which layers exist |
| [roles](roles.md) | Which document roles exist, where each lives, what may enter and leave |
| [repository-readme](repository-readme.md) | What a repository README must answer, and what it must not become |
| [flow](flow.md) | Which level owns a file, how work moves from idea to closeout, who decides and how a change is reviewed |
| [rules](rules.md) | Which rules are enforced, how budgets are measured, what may be retired |
| [code](code.md) | Which code principles bind every repository, and how a pattern differs |
| [code/](code/README.md) | The worked shapes: one pattern per page, each with its adoption condition |
| [overlays](overlays.md) | What the language-agnostic core promises, what each overlay supplies |
| [committing](committing.md) | What every commit message must state, and which parts a repository may override |

Migration is an operating mode, not a norm page: see [workflow](../workflow.md), Mode 3.

## Reading paths

First pass: [foundations](foundations.md) → [roles](roles.md) → [flow](flow.md) → [rules](rules.md).

Reference: [overlays](overlays.md) when a language overlay is involved; [committing](committing.md) when writing a commit message; [repository-readme](repository-readme.md) when writing or reviewing the repository front page.

The file names carry the subject; the order lives here. Adding a page does not renumber the set, and moving a page in a reading path does not break a citation.

## Status

The template and the skill are downstream of these pages. A statement here that the template contradicts is a template bug; a statement the template cannot express is a norm bug. A target repository's general-norm page — a page that consumes one norm page as a whole — is a base pointer to that page plus its own deviations; every other role page records this repository's own facts and links the norm page and section it relies on instead of copying them. A page that restates the norm is a finding, not a copy.

## Reading rule

A page is normative only for the question in its row. Do not read `rules.md` to learn where an ADR lives, and do not read `roles.md` to learn how a work package closes. When a page needs another page's definition, it links; it does not restate. Duplication between norm pages is a blocker, not a style issue.
