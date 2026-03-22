# Ardtire Society

## Civic Governance Platform

A professional-grade civic governance platform monorepo demonstrating how to model, implement, and operate a complex institutional system across domain modeling, API design, typed clients, frontend applications, editorial content management, database design, and internal documentation automation.

This repository is intentionally structured as a showcase-quality engineering project. It is designed to demonstrate strong software engineering judgment across:

- domain-driven design
- monorepo architecture
- contract-first API design
- backend service boundaries
- typed client integration
- frontend application architecture
- database modeling and migrations
- developer tooling
- documentation as a first-class engineering concern

---

## What this project is

The Civic Governance Platform is a full-stack system for managing the public and internal workflows of a governance-oriented organization.

At a high level, the platform is intended to support:

- public-facing governance information
- authenticated administrative workflows
- proposal drafting and submission
- governance bodies, offices, and sessions
- publication and records workflows
- editorial content management
- shared contracts and typed client consumption across applications
- internal developer tooling for documentation and repository intelligence

This repo is not a toy app and not a generic CRUD demo. It is a systems-oriented project built around a non-trivial institutional domain.

---

## What this repository demonstrates

This repository is meant to show potential collaborators, hiring managers, and engineers that the author can design and build software with the mindset of a seasoned engineer.

Specifically, this repo demonstrates:

- **clear architectural boundaries**
  - separation between domain, contracts, API, UI, CMS, persistence, and tooling

- **contract-first backend development**
  - shared validated request/response models used across service and client layers

- **typed cross-application integration**
  - a dedicated typed client package for consuming the governance API

- **front-to-back vertical slice implementation**
  - domain model → contracts → API → persistence → client → UI

- **source-of-truth discipline**
  - one canonical home per major concern

- **portfolio-grade engineering communication**
  - clear repo structure, contributor guidance, architecture docs, and operational intent

---

## Architecture overview

The repository follows a monorepo structure with clear boundaries between runnable applications, shared libraries, infrastructure schema, and internal tooling.

### Primary architectural layers

#### 1. Domain layer

The domain layer defines the canonical business vocabulary of the system:

- proposals
- amendments
- governance bodies
- offices
- sessions
- publication state
- records lifecycle

This layer should contain the shared language of the system, not transport or framework concerns.

#### 2. Contracts layer

The contracts layer defines validated request and response models for the API.

This layer exists to ensure:

- consistent payload shapes
- shared validation rules
- stable boundaries between API producers and consumers
- less duplication between backend and frontend

#### 3. Governance API

The governance API is the canonical backend service for institutional state and workflow orchestration.

This service is responsible for:

- domain mutations
- workflow enforcement
- persistence orchestration
- authorization and actor context
- public and internal governance operations

#### 4. Typed client

The typed client provides a stable consumer interface for applications that need to interact with the governance API.

This allows the web application and other consumers to call the API through a strongly typed boundary rather than ad hoc fetch logic.

#### 5. Web application

The web application provides the primary public and administrative user experience.

This layer is responsible for:

- public-facing governance pages
- authenticated administrative workflows
- application-specific view models and UI composition
- consuming the governance API via the typed client

#### 6. CMS / editorial surface

The CMS is the editorial content boundary.

It is intentionally distinct from canonical governance state.

The CMS manages content such as:

- informational pages
- announcements
- editorial materials
- presentation-oriented content

The governance API remains the source of truth for institutional workflows and official governance state.

#### 7. Database and persistence

Persistence is modeled through Prisma and relational schema/migrations.

This layer exists to:

- define durable system state
- support controlled evolution of the data model
- keep schema changes reviewable and explicit

#### 8. Internal tooling

This repo also includes internal tooling for documentation and repository intelligence.

These tools are intended to help with:

- repo inventory
- documentation impact analysis
- AI context compilation
- engineering documentation maintenance

---

## Monorepo structure

```text
.
├── apps/
│   ├── web/         # Public and authenticated frontend application
│   ├── gov-api/     # Canonical governance API
│   └── cms/         # Editorial content management application
├── packages/
│   ├── domain/      # Canonical domain vocabulary and shared types
│   ├── contracts/   # Shared validated request/response contracts
│   └── gov-client/  # Typed client for the governance API
├── tools/
│   └── docs-engine/ # Internal documentation and repository tooling
├── prisma/          # Database schema and migrations
├── docs/            # Engineering, architecture, and operational documentation
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── CONTRIBUTING.md
````

---

## Package namespace

All first-party packages use the following namespace:

* `@civic-governance/*`

Examples:

* `@civic-governance/web`
* `@civic-governance/gov-api`
* `@civic-governance/cms`
* `@civic-governance/domain`
* `@civic-governance/contracts`
* `@civic-governance/gov-client`
* `@civic-governance/docs-engine`

This keeps the workspace coherent, professional, and easy to scan.

---

## Technology direction

This repository is intentionally technology-opinionated where that improves clarity and maintainability.

Core technologies are expected to include:

* **Node.js** for runtime and tooling
* **pnpm** for workspace/package management
* **TypeScript** for primary implementation language
* **TanStack Start + SolidJS** for the main web application
* **Hono** for the governance API
* **Zod** for shared contract validation
* **Prisma + PostgreSQL** for persistence
* **Payload CMS** for editorial content management
* **Vitest** for testing

The exact implementation may evolve, but the architectural boundaries above are the main source of truth.

---

## Source-of-truth model

A major engineering principle in this repo is that each concern should have one canonical home.

### Canonical sources of truth

* **Domain vocabulary:** `packages/domain`
* **API contracts and validation:** `packages/contracts`
* **Canonical application workflows and mutations:** `apps/gov-api`
* **Typed client integration surface:** `packages/gov-client`
* **Persistence model:** `prisma/schema.prisma`
* **Editorial content model:** `apps/cms`
* **Architecture and operational guidance:** `docs/`

This project intentionally avoids letting multiple layers redefine the same concept independently.

---

## Current implementation philosophy

This repository is being rebuilt and curated as a greenfield, portfolio-grade implementation.

The implementation approach is:

1. define the repo contract
2. define the domain vocabulary
3. define validated API contracts
4. implement a real backend vertical slice
5. connect persistence
6. expose a typed client
7. build public and authenticated UI flows
8. expand into editorial and publication workflows
9. automate documentation and quality checks
10. polish the repo for long-term maintainability

The goal is not to accumulate scaffolding.
The goal is to produce a coherent, reviewable engineering narrative.

---

## Expected application responsibilities

### `apps/web`

The main frontend application.

Expected responsibilities:

* public-facing governance routes
* authenticated administrative flows
* consuming the governance API through the typed client
* presentation logic and route composition

### `apps/gov-api`

The canonical backend for governance state and workflow.

Expected responsibilities:

* mutations and workflow enforcement
* actor context and authorization boundaries
* persistence orchestration
* public and internal governance endpoints

### `apps/cms`

The editorial content surface.

Expected responsibilities:

* management of informational and editorial content
* role-aware editorial workflows
* content publication that is distinct from canonical governance state

---

## Expected shared package responsibilities

### `packages/domain`

Expected to contain:

* enums
* shared domain types
* lifecycle vocabulary
* non-framework domain modeling primitives

### `packages/contracts`

Expected to contain:

* request schemas
* response schemas
* API-facing DTO contracts
* shared validation rules

### `packages/gov-client`

Expected to contain:

* typed API client methods
* transport abstraction
* API error handling surface
* application-consumable client modules

---

## Internal tooling

### `tools/docs-engine`

This repo treats documentation as a real engineering asset, not as afterthought text.

The docs engine is expected to support internal workflows such as:

* repository inventory
* doc coverage awareness
* change impact analysis
* AI context generation from canonical sources

This tooling exists to support maintainability and developer leverage at scale.

---

## Development principles

This repository is built around a few explicit engineering principles.

### Clear boundaries over convenience

Different layers should have clear roles.
If two parts of the system own the same concern, the architecture is wrong.

### Vertical slices over speculative breadth

One complete workflow is better than ten half-finished modules.

### Contracts before integration sprawl

The shape of data crossing service boundaries should be explicit, validated, and shared.

### Green repository discipline

Commits should leave the repo valid for the scope that exists at that point.

### Documentation reflects reality

Docs should describe the implemented system, not merely the intended one.

---

## Getting started

### Prerequisites

* Node.js `>= 20.11.1`
* pnpm `>= 10.0.0`

### Install dependencies

```bash
pnpm install
```

### Run the main validation pipeline

```bash
pnpm typecheck
pnpm test
pnpm build
```

### Start local development

```bash
pnpm dev
```

Because this is a monorepo, individual packages and apps may also expose their own scripts.

Examples:

```bash
pnpm --filter @civic-governance/web dev
pnpm --filter @civic-governance/gov-api dev
pnpm --filter @civic-governance/cms dev
```

---

## Root scripts

The root package exposes monorepo-wide orchestration scripts:

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm format
pnpm clean
pnpm check
```

### Script intent

* `dev`
  Runs package/app development scripts in parallel where defined.

* `build`
  Builds all workspace packages/apps that define a build script.

* `typecheck`
  Runs TypeScript validation across the workspace.

* `lint`
  Runs lint tasks across the workspace.

* `test`
  Runs test tasks across the workspace.

* `format`
  Runs formatting tasks across the workspace.

* `clean`
  Cleans generated artifacts for packages that define a clean script.

* `check`
  Runs the standard validation sequence.

---

## Development workflow

A typical workflow for implementing a new vertical slice should look like this:

1. define or extend the domain vocabulary
2. add or update validated contracts
3. implement backend workflow handlers
4. add persistence integration if needed
5. expose the slice through the typed client
6. build the consuming frontend route or workflow
7. add tests
8. update docs where architecture or behavior changed

This ordering is deliberate.
It keeps the system coherent and reduces avoidable rework.

---

## Contribution standards

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before making changes.

Highlights:

* keep package boundaries real
* prefer one logical change per commit
* avoid speculative exports and placeholder files
* do not commit generated artifacts or secrets
* keep docs aligned with the system as actually implemented

---

## Repository hygiene

This repository intentionally excludes:

* `node_modules`
* build output
* coverage artifacts
* local environment files
* framework caches
* generated dependency trees
* local deployment state

The project should remain clean, portable, and reviewable from git alone.

---

## Roadmap direction

The intended implementation sequence is approximately:

### Foundation

* monorepo contract
* contributor standards
* root documentation
* CI and validation

### Core domain and contracts

* governance vocabulary
* proposal model
* validated contracts
* schema foundation

### Backend vertical slices

* proposal draft workflow
* proposal submission workflow
* identity and authorization boundary
* governance bodies, offices, sessions

### Frontend integration

* public proposal listing/detail
* authenticated admin flows
* typed client consumption
* route-level user experience

### Editorial and publication

* CMS/editorial workflows
* records and gazette flows
* publication lifecycle

### Tooling and polish

* docs engine
* architecture/runbook docs
* screenshots and repo-tour material
* release-quality validation

---

## Why this repo exists in public

This repository exists as both:

1. a serious systems design and implementation exercise, and
2. a portfolio artifact intended to demonstrate software engineering capability in a way that is legible to other engineers

It is meant to show not only that features can be built, but that they can be built with:

* architectural discipline
* source-of-truth clarity
* strong package boundaries
* implementation sequencing
* maintainability in mind

---

## What to look at first

If you are reviewing this repository for technical evaluation, start here:

1. `README.md`
2. `CONTRIBUTING.md`
3. `packages/domain`
4. `packages/contracts`
5. `apps/gov-api`
6. `packages/gov-client`
7. `apps/web`
8. `prisma/schema.prisma`
9. `docs/`

That path gives the clearest picture of how the system is intended to fit together.

---

## Screenshots

> Placeholder: screenshots and architecture diagrams will be added as the rebuilt implementation matures.

Recommended future additions:

* public proposal listing page
* proposal detail page
* authenticated admin proposal workflow
* CMS editorial screen
* architecture diagram
* API/package dependency diagram

---

## Status

This repository is under active reconstruction as a deliberate, portfolio-grade greenfield implementation.

The project direction is stable.
The codebase is being rebuilt in a cleaner, more coherent sequence so that the repository history and structure reflect professional engineering standards from the start.

---

## License

> Placeholder: add the project license here once chosen.

````

A strong next commit after this would be:

```text
docs(repo): add root README and portfolio-oriented project overview
````

And after that, I would move straight into the initial GitHub Actions workflow.
