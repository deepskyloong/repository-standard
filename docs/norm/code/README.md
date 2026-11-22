# Code patterns

A pattern is a solution shape a repository adopts when its condition holds. One topic per page; this index carries one row per topic, the condition it applies under, and the link. A pattern is not a principle: a constraint that applies wherever code is written lives at `docs/norm/code.md`.

## Index

| Topic | Applies when | Page |
| --- | --- | --- |
| Messages | A program emits text a human reads, and another consumer may read it too: a tuned threshold, a second output format, or codes that tooling should group | [messages](messages.md) |
| Findings | A checker or linter reports problems a reader must fix or judge, and the report may later be grouped, counted, or routed | [findings](findings.md) |

## Admission and exit

A topic enters when a shape is needed by more than one repository and has a worked instance — a real program in which the shape ran. The page states its condition, the shape, the guards, and the verification; it links the principle it applies and does not restate it. A shape needed by one repository stays in that repository.

A topic leaves when the shape stops being true. The evidence becomes a case at `docs/knowledge/cases/`, and the row and the page go together.
