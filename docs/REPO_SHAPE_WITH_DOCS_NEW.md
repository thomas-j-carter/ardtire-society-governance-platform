REPO_SHAPE_WITH_DOCS_NEW.md

The governing idea is:

- **canonical content lives in the repo**
- **docs-engine manages automation and continuity**
- **Docusaurus publishes**
- **Decap edits selected content**
- **Pagefind indexes the built portal**
- **GitHub Issues/Projects runs execution**

This structure will keep our initial `docs/ai` and `tools/docs-engine` model intact 
while giving us a modern portal and workflow. 

- Docusaurus supports versioned docs, blog content, and multiple docs plugin 
instances; 
- Decap is Git-backed and supports editorial workflow; 
- Changesets is built for monorepo versioning; 
- Pagefind is a post-build static indexer; 
- GitHub Projects supports table, board, roadmap, custom fields, and sub-issues; and 
- Playwright is a solid fit for cross-browser smoke coverage. 

# 1. Final monorepo shape

```text
.
├── apps/
│   ├── web/
│   ├── gov-api/
│   └── knowledge/                       # Docusaurus portal
│       ├── blog/
│       ├── docs/                        # generated/synced mountpoint
│       ├── journal/                     # generated/synced mountpoint
│       ├── static/
│       │   ├── admin/
│       │   │   ├── config.yml          # Decap config
│       │   │   └── index.html          # Decap entry
│       │   └── img/
│       ├── src/
│       │   ├── components/
│       │   ├── css/
│       │   └── pages/
│       ├── sidebars/
│       │   ├── docs.ts
│       │   ├── journal.ts
│       │   ├── adr.ts
│       │   └── ai.ts
│       ├── docusaurus.config.ts
│       ├── package.json
│       └── playwright.config.ts
├── packages/
│   ├── gov-client/
│   ├── ui/
│   ├── config/
│   └── shared/
├── docs/
│   ├── README.md
│   ├── ai/
│   │   ├── README.md
│   │   ├── context/
│   │   │   ├── PROJECT_CONTEXT.md
│   │   │   ├── ARCHITECTURE_SUMMARY.md
│   │   │   ├── REPO_STATE_SUMMARY.md
│   │   │   └── IMPLEMENTATION_STATE.md
│   │   ├── continuity/
│   │   │   ├── HANDOFF_PACKET.md
│   │   │   ├── CURRENT_PRIORITIES.md
│   │   │   └── OPEN_QUESTIONS.md
│   │   ├── prompts/
│   │   │   ├── MASTER_CONTINUATION_PROMPT.md
│   │   │   ├── MASTER_IMPLEMENTATION_PROMPT.md
│   │   │   └── MASTER_DOCS_PROMPT.md
│   │   ├── inventories/
│   │   ├── manifests/
│   │   ├── snapshots/
│   │   └── handoffs/
│   ├── architecture/
│   ├── domain/
│   ├── product/
│   ├── project/
│   ├── runbooks/
│   ├── api/
│   └── adr/
├── journal/
│   ├── README.md
│   ├── daily/
│   ├── milestones/
│   ├── postmortems/
│   └── ideas/
├── blog/
│   ├── engineering/
│   ├── releases/
│   └── essays/
├── tools/
│   └── docs-engine/
│       ├── README.md
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── cli/
│       │   ├── config/
│       │   ├── inventory/
│       │   ├── analyzers/
│       │   ├── compilers/
│       │   ├── generators/
│       │   ├── validators/
│       │   ├── manifests/
│       │   ├── templates/
│       │   ├── sync/
│       │   └── shared/
│       ├── output/
│       └── snapshots/
├── .changeset/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

# 2. Ownership model

Hard rules:

- `docs/` .................. Stable canonical docs.
- `docs/ai/` ............... Canonical AI continuity system. Keep it first-class.
- `journal/` ............... Raw engineering record.
- `blog/` .................. Polished public-facing writing.
- `tools/docs-engine/` ..... Automation layer: inventory, drift checks, context 
                             compilation, sync, handoff generation.
- `apps/knowledge/` ........ Presentation layer only.

# 3. Docusaurus content model

Docusaurus supports multiple docs plugin instances and versioning, so we will 
split content this way: 

- one docs instance for canonical docs, 
- one for journal, 
- one for ADRs, and 
- one internal-only or semi-private instance for `docs/ai`

Routes:

- `/docs` → canonical docs
- `/journal` → engineering journal
- `/adr` → ADR log
- `/blog` → public posts and release notes
- `/ai` → continuity docs, optionally hidden from public nav
- `/roadmap` → custom page, sourced from project docs or GitHub

# 4. What Decap will edit

Decap-managed:

- `journal/daily/**`
- `journal/milestones/**`
- `blog/**`
- selected `docs/project/**`
- selected `docs/product/**`

Git-only:

- `docs/ai/**`
- `docs/architecture/**`
- `docs/domain/**`
- generated artifacts
- `tools/docs-engine/**`

Decap’s editorial workflow creates pull requests for unpublished entries and 
supports `publish_mode: editorial_workflow`, which fits our need to reduce editing 
pain without giving up Git review.

# 5. Docs-engine responsibilities

We are keeping `tools/docs-engine` as a real app, not a loose script folder.

Core commands:

- `inventory` — scan repo and emit machine-readable inventory
- `changed` — analyze changed files
- `impact` — map file changes to impacted docs
- `compile-context` — build `docs/ai/context/*`
- `build-handoff` — generate continuity packet
- `validate` — required docs, canonicality, placement, drift
- `sync-knowledge` — stage content into `apps/knowledge`
- `snapshot` — freeze state at release boundaries

CLI surface:

```text
pnpm docs-engine inventory
pnpm docs-engine changed --base main --head HEAD
pnpm docs-engine impact
pnpm docs-engine compile-context
pnpm docs-engine build-handoff
pnpm docs-engine validate
pnpm docs-engine sync-knowledge
pnpm docs-engine snapshot --tag v0.1.0
```

# 6. Content flow

Promotion pipeline:

**issues/project work** → execution
**journal entry** → raw narrative
**ADR** → decision record
**docs** → stable truth
**docs/ai** → machine-friendly continuity
**blog** → polished outward narrative

That means:

- every meaningful work session gets a journal entry
- every important architectural decision gets an ADR
- every stabilized pattern gets promoted into docs
- every release updates changesets, changelog, and milestone journal entry
- docs-engine compiles continuity artifacts from all of the above

# 7. Root workspace scripts

At the repo root, we define these scripts:

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel --filter ./apps/* dev",
    "build": "pnpm run docs:prepare && pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",

    "knowledge:dev": "pnpm --filter @ardtire/knowledge dev",
    "knowledge:build": "pnpm --filter @ardtire/knowledge build",
    "knowledge:serve": "pnpm --filter @ardtire/knowledge serve",

    "docs:inventory": "pnpm --filter @ardtire/docs-engine inventory",
    "docs:impact": "pnpm --filter @ardtire/docs-engine impact",
    "docs:validate": "pnpm --filter @ardtire/docs-engine validate",
    "docs:context": "pnpm --filter @ardtire/docs-engine compile-context",
    "docs:handoff": "pnpm --filter @ardtire/docs-engine build-handoff",
    "docs:sync": "pnpm --filter @ardtire/docs-engine sync-knowledge",
    "docs:prepare": "pnpm docs:inventory && pnpm docs:context && pnpm docs:sync && pnpm docs:validate",

    "search:index": "pagefind --site apps/knowledge/build",
    "knowledge:postbuild": "pnpm search:index",

    "test:knowledge": "pnpm --filter @ardtire/knowledge test:e2e",

    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

# 8. Docusaurus implementation strategy

Use Docusaurus as a consumer, not the canonical store.

There are two ways to feed content into it:

### Best for our repo: 

sync/copy content into `apps/knowledge`; our docs-engine writes staged content into:

- `apps/knowledge/docs`
- `apps/knowledge/journal`
- `apps/knowledge/ai`

Simple, reliable.

### Alternative (More advanced): point plugins at external paths

Possible, but more brittle in monorepos and local tooling. For our current stage, 
we're choosing the first approach.

# 9. Initial Docusaurus plugin layout

- default docs plugin for canonical docs
- docs plugin instance for journal
- docs plugin instance for ADR
- docs plugin instance for AI continuity
- built-in blog plugin for `blog/`

Docusaurus requires unique plugin IDs for multiple content instances. 

Conceptually:

```ts
plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'journal',
      path: 'journal',
      routeBasePath: 'journal',
      sidebarPath: './sidebars/journal.ts',
    },
  ],
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'adr',
      path: 'docs/adr',
      routeBasePath: 'adr',
      sidebarPath: './sidebars/adr.ts',
    },
  ],
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'ai',
      path: 'ai',
      routeBasePath: 'ai',
      sidebarPath: './sidebars/ai.ts',
    },
  ],
]
```

# 10. Search plan

Stage 1:

- build Docusaurus
- run Pagefind against the built output
- deploy static bundle

Pagefind is designed for static indexing after build and allows controlling what 
gets indexed with `data-pagefind-*` attributes.

Stage 2:

- switch to Algolia DocSearch if search scale or relevance becomes a pain point

Because the underlying content remains canonical in-repo, swapping search later 
is low-risk. Docusaurus has official search integration docs.

# 11. Playwright coverage for the knowledge portal

Use Playwright for smoke and regression coverage on the portal itself. Initial 
test set:

- home page loads
- `/docs` loads
- `/journal` loads
- `/blog` loads
- `/adr` loads
- `/ai` loads if enabled
- search UI loads
- a Mermaid-heavy page renders
- Decap admin page loads
- no major console errors on key pages

Playwright officially supports Chromium, Firefox, and WebKit, and its setup flow 
includes browser selection and GitHub Actions support.

# 12. Changesets policy

Use Changesets for:

- package versioning
- monorepo release coordination
- changelog generation
- release notes input

Changesets is built specifically around monorepos and coordinated versioning 
across packages. 

Rule:

- any change affecting a publishable package or externally relevant behavior gets 
  a changeset
- release cut triggers:
  - `changeset version`
  - docs version snapshot
  - milestone journal entry
  - release blog post

# 13. GitHub Issues and Projects setup

GitHub Projects supports table, board, and roadmap views, plus custom fields and 
issue hierarchies via sub-issues.

Create one project:

**Ardtire Platform Build**

Views:

- Backlog (table)
- Active Sprint (board by Status)
- Roadmap (timeline)
- Docs/Knowledge (table filtered by area)
- Bugs (board)

Custom fields:

- Status
- Priority
- Area
- Type
- Target Release
- Start Date
- Target Date
- Effort
- Risk

Statuses:

- Backlog
- Ready
- In Progress
- Blocked
- Review
- Done

Areas:

- identity
- membership
- governance
- records
- web
- gov-api
- docs
- ai
- knowledge-portal
- docs-engine
- search
- editorial
- release

Types:

- epic
- feature
- task
- bug
- docs
- research
- chore

# 14. Initial epic issues to create

Create these first parent issues:

1. Knowledge Portal Foundation
2. Docs Engine Reintegration
3. AI Continuity System
4. Editorial Workflow with Decap
5. Search Layer with Pagefind
6. Release System with Changesets
7. Knowledge Portal Smoke Tests
8. Documentation Taxonomy and Migration
9. Journal and Blog Workflow
10. Docs Versioning Strategy

Each should get sub-issues. GitHub supports nested sub-issues, progress rollups, 
and viewing parent/sub-issue progress in Projects.

# 15. Initial implementation order

## Phase 0 — skeleton

Create:

- `apps/knowledge`
- `docs/ai`
- `journal`
- `blog`
- `tools/docs-engine`
- `.changeset`

## Phase 1 — knowledge portal

Stand up Docusaurus with:

- docs
- journal
- ADR
- blog
- AI section placeholder

## Phase 2 — docs-engine reintegration

Implement:

- inventory
- sync-knowledge
- compile-context
- validate

## Phase 3 — editorial

Add Decap for:

- journal
- blog
- selected product/project docs

## Phase 4 — search

Add Pagefind post-build indexing and search page integration

## Phase 5 — testing

Add Playwright smoke tests and GitHub Actions CI

## Phase 6 — releases

Add Changesets workflow and docs versioning policy

# 16. Practical decisions to lock now

Use these conventions now so we do not revisit them later.

Journal filename format:

```text
YYYY-MM-DD-short-topic.md
```

ADR filename format:

```text
ADR-001-short-title.md
```

Blog filename format:

```text
YYYY-MM-DD-title.mdx
```

AI continuity files:

- human-readable but machine-friendly
- stable names
- no decorative structure
- predictable headings

Generated vs authored split:

- generated files live under `docs/ai/inventories`, `docs/ai/manifests`, `docs/ai/snapshots`
- authored continuity docs live under `docs/ai/context`, `docs/ai/continuity`, `docs/ai/prompts`

# 17. Here be dragons...

We can not let either Docusaurus or Decap become the “truth layer.”

Truth should stay here:

- docs
- docs/ai
- journal
- blog
- docs-engine outputs

Everything else should be replaceable.

That keeps us free to later swap:

- Decap → Tina
- Docusaurus → Astro/Starlight
- Pagefind → Algolia

without rewriting the knowledge system.

# 18. Next up...

Next we will work on the actual scaffold package-by-package, starting with:

1. root `package.json` + `pnpm-workspace.yaml`
2. `apps/knowledge` Docusaurus app scaffold
3. `tools/docs-engine` package scaffold
4. Decap admin files
5. Pagefind and Playwright wiring
6. GitHub Actions workflows
7. starter docs/journal/blog/ai files

Proceeding this way gives us a runnable foundation instead of just a plan.