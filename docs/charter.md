# Charter

## What this is

A normative description of how a long-lived repository organizes its documents, its work, and the code principles every repository it governs shares. It is written to be copied: a new project reads the norm, copies the template, and starts with a structure instead of inventing one. An existing project reads the migrate mode of `docs/workflow.md` and moves one role at a time.

## Who it serves

One maintainer who runs several repositories over years, alone or with agents. Not a team with a release train, not a library with external consumers, not a service with an on-call rotation. Those cases can use the same roles, but the defaults here are tuned for a single person who will return to the repository months later with no memory of it.

## In scope

- The set of document roles, their homes, admission rules, exit rules, and authority ranges.
- The rules that keep those roles from duplicating each other: single source, index autonomy, change surface, measurable budgets.
- The flow from an undecided idea to a closed work package to a recorded decision to a durable lesson.
- The split between language-agnostic structure and language-specific toolchain.
- Code principles that apply to any repository, and the worked shapes that carry them.
- The migration path from an existing repository.

## Out of scope

- Business architecture, algorithm choices, or the internal design of one system.
- Language style guides beyond the overlay's C6 contract and its gate; a preference no overlay states stays in the repository that holds it.
- CI vendor configuration. CI is a forwarder of the local gate, not a second gate.
- An interactive scaffolder, a template repository with variables, or a plugin. These are possible later; the spec does not depend on them.

## Hard constraints

1. English for all repository-maintained text.
2. One role, one home.
3. No empty directories, no speculative roles.
4. Budgets must be measurable with one command and stated with a unit.
5. The specification is normative; the template and the skill are downstream.

## Success criteria

- A new repository reaches "initialized" in one sitting, and its owner can answer "where does this document go" without opening a second opinion.
- An existing repository can migrate one role per commit without breaking a single cross-reference.
- An agent entering either repository finds the routing table in `AGENTS.md` and does not need the spec's prose to place a new file.
- A budget breach is detectable in one command, not in an argument.
