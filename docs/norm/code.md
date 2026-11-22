# Code principles

Code principles bind every repository that names the norm source. They are `weak`: a person or an agent applies them in review and says so; no stage fails on them. A constraint a stage can check belongs to that stage and to the overlay's C6, not here. A principle enters only with an observable symptom and the requirement it serves; a constraint that cannot name how it is violated is taste, and taste stays in the repository that holds it.

A principle yields to an explicit requirement: a contract a consumer relies on, a stage the overlay's gate demands, or a measurement that shows the cost. `We might need it` is not a requirement.

## YAGNI

| Principle | Symptom of violation |
| --- | --- |
| Build for today's requirement, not an imagined future one. | A parameter, config key, or branch that serves a call nobody makes. |
| Add no speculative abstraction, config, parameter, or error handling. | A knob nobody sets; a catch branch no input can reach. |
| Add no compatibility shim without a real external caller. | A second code path kept for a caller that exists neither in the tree nor in an installed package. |
| Delete dead code and stubs; git history is the later. | A function or module with no caller; a placeholder naming a change nobody scheduled. |
| Keep one logical change per commit; surface an adjacent issue separately. | A subject that needs `and`; a refactor riding in a feature commit. |

`Delete dead code` is about code, not records: an ADR, a backlog item, and a closed package are kept on purpose (`docs/norm/rules.md`, "Retirement and the three exceptions"). The commit row's rule is `docs/norm/committing.md`, "One logical change"; this page carries only its symptom.

## Simplicity

| Principle | Symptom of violation |
| --- | --- |
| Match complexity to the problem; boring and obvious wins. | A new dependency, layer, or pattern the requirement does not name. |
| Use no framework for a script-sized problem; add no scaling, cache, or optimization without measurement. | A cache with no measured hit rate; a concurrency layer over a synchronous call. |
| Write no interface for a single implementation, and no wrapper chain that adds no behavior. | An interface with one implementer; three layers forwarding the same call. |
| Prefer duplication to the wrong abstraction; abstract on the third occurrence. | A shared helper whose callers pass flags that change what it does. |
| Flat over nested, concrete over generic, explicit over magic. | A callback inside a callback; a string-keyed dispatch where a call would do; behavior that depends on an unstated default. |

A solution shape that a repository adopts when a condition holds is a pattern, not a principle. Patterns live at `docs/norm/code/`, one per page; the [chapter index](code/README.md) states each one's adoption condition.
