# Contributing

Thanks for contributing to the Civic Governance Platform.

This repository is intentionally structured as a professional-grade monorepo. The goal is not only to ship features, but to do so with clear architecture, strong package boundaries, disciplined commit hygiene, and maintainable documentation.

## Purpose

This repository demonstrates the implementation of a civic governance platform with:

- a public web application
- a canonical governance API
- shared domain and contract packages
- a typed client for cross-application integration
- editorial/CMS capabilities
- developer tooling and documentation automation

Every contribution should make the system clearer, more correct, more maintainable, or more operable.

---

## Repository layout

```text
apps/       Runnable applications
packages/   Shared libraries and contracts
tools/      Internal tooling and automation
docs/       Engineering, product, and operational documentation
prisma/     Canonical database schema and migrations
````

Expected package scope:

* `@civic-governance/*`

Examples:

* `@civic-governance/web`
* `@civic-governance/gov-api`
* `@civic-governance/contracts`
* `@civic-governance/domain`
* `@civic-governance/gov-client`

---

## Prerequisites

* Node.js `>= 20.11.1`
* pnpm `>= 10.0.0`

---

## Getting started

Install dependencies:

```bash
pnpm install
```

Run validation:

```bash
pnpm typecheck
pnpm test
pnpm build
```

For day-to-day development:

```bash
pnpm dev
```

---

## Engineering principles

### 1. Keep one source of truth per concern

Use one canonical home for each concern:

* **Domain vocabulary:** `packages/domain`
* **API contracts and validation:** `packages/contracts`
* **Canonical mutations and orchestration:** `apps/gov-api`
* **Typed client for consumers:** `packages/gov-client`
* **Persistence model:** `prisma/schema.prisma`
* **Editorial content:** `apps/cms`
* **Architecture and operational guidance:** `docs/`

Do not duplicate core concepts across layers unless there is a deliberate translation boundary.

### 2. Favor vertical slices over speculative breadth

Build one workflow completely before expanding laterally.

Good:

* define proposal domain model
* define proposal API contracts
* implement proposal API handlers
* add proposal client methods
* render proposal UI

Bad:

* create ten half-finished modules in parallel
* export files that do not exist yet
* scaffold broad future surface area without working behavior

### 3. Keep package boundaries real

Packages should have clear public APIs and clear responsibilities.

* import through package entry points where practical
* avoid deep cross-package imports
* do not treat `apps/*` as general-purpose libraries
* do not use workspace aliases for third-party packages

### 4. Keep the repo green

A commit should leave the repository valid for the scope that exists at that point.

At minimum, before committing, run:

```bash
pnpm typecheck
pnpm test
```

When relevant, also run:

```bash
pnpm build
```

### 5. Prefer small, reviewable commits

One logical change per commit.

A good commit should be explainable in one sentence.

Examples:

* `chore(repo): initialize monorepo contract and development standards`
* `feat(domain): define canonical governance enums and shared entity types`
* `feat(gov-api): implement proposal draft and submission workflow`

Avoid:

* `misc fixes`
* `progress`
* `stuff`
* giant omnibus commits mixing refactors, features, docs, and generated files

---

## Branching

Use short-lived branches from `main`.

Recommended naming:

* `feat/<area>-<change>`
* `fix/<area>-<bug>`
* `docs/<area>-<change>`
* `chore/<area>-<change>`
* `refactor/<area>-<change>`
* `test/<area>-<change>`

Examples:

* `feat/proposals-draft-flow`
* `fix/gov-client-pagination`
* `docs/repo-readme`
* `refactor/gov-api-request-context`

Rebase or otherwise keep history clean before merging.

---

## Commit conventions

Use Conventional Commit style:

* `feat`
* `fix`
* `docs`
* `refactor`
* `test`
* `chore`
* `ci`

Format:

```text
type(scope): concise summary
```

Examples:

* `feat(contracts): add validated proposal request schemas`
* `fix(web): handle empty proposal state correctly`
* `docs(dev): add source-of-truth policy for contracts and schema`

For major commits, add a body explaining:

* what changed
* why it changed
* any important tradeoffs or follow-up work

---

## Definition of done

A change is not done until all of the following are true:

* the code is implemented cleanly
* impacted contracts/types are updated
* impacted tests are added or updated
* the package or app typechecks
* relevant documentation is updated
* there are no dead exports
* there are no placeholder files pretending to be complete
* no generated artifacts or secrets are committed

---

## Code style

### TypeScript

* prefer explicit, readable types at public boundaries
* prefer narrow interfaces over large ambient structures
* avoid `any`
* keep strict mode assumptions intact
* model state transitions explicitly

### Error handling

* do not swallow errors
* prefer structured application errors
* HTTP-facing services should return stable, predictable error shapes

### Naming

* use domain names consistently
* avoid synonyms for the same core concept
* use singular/plural consistently across routes, models, and files

---

## Testing expectations

Every meaningful domain or workflow change should include tests at the right level.

Examples:

* domain rule tests
* contract validation tests
* application service tests
* route tests
* repository integration tests when persistence behavior matters

Favor focused tests over broad, brittle test suites.

---

## Documentation expectations

Documentation is part of the product.

Update docs when you change:

* architecture boundaries
* package responsibilities
* route shapes
* persistence model
* operational behavior
* developer workflows

Important: docs should describe the real system, not an imagined future system.

Keep planning notes separate from canonical engineering documentation.

---

## Secrets, generated files, and repository hygiene

Never commit:

* `.env` files
* API tokens or credentials
* generated dependency trees such as `node_modules`
* framework build output such as `.next`, `.docusaurus`, `dist`, or coverage artifacts
* editor-specific local state unless explicitly intended

If a file is generated, either:

* regenerate it in CI/build, or
* commit it only when there is a deliberate reason and that reason is documented

Default posture: **do not commit generated output**.

---

## Pull request expectations

A good pull request should include:

* a concise problem statement
* the implementation approach
* validation steps performed
* screenshots for user-facing UI changes when relevant
* notes on follow-up work or deferred concerns

Keep pull requests scoped and reviewable.

---

## Architecture discipline

Before adding a new package, module, or service, ask:

1. Does this introduce a genuinely new boundary?
2. Could this responsibility live cleanly inside an existing package?
3. What is the source of truth for this concern?
4. What are the public APIs of this boundary?
5. What tests and docs must exist with it?

New structure should be earned, not added speculatively.