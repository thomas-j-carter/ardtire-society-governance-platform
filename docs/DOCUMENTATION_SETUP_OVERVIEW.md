# Documentation Setup 

My initial thought were to treat the docs portal as a fresh standalone docs app, 
however I've decided against that. Instead, I'm going to treat it as the 
**publishing surface** for the previously-established documentation system that 
includes:

* canonical docs
* `docs/ai` or `.ai` continuity context
* the `tools/docs-engine` automation layer
* engineering journal / build log
* blog
* release notes / changelog

That being said, the decision now is to **preserve and formalize** my original 
ideas rather than replacing them.

## My Decision as of now...

Going forward I'm going to use this stack:

* **GitHub Issues:** ...... work items
* **GitHub Projects:** .... planning, board, table, roadmap, milestones, and 
                            parent/sub-issue tracking; 
                            GitHub supports table/board/roadmap views and 
                            sub-issues that roll up into parent issue progress.
* **Docusaurus:** ......... as the knowledge portal, because it supports docs, 
                            blog content, official content plugins, and versioned 
                            documentation. 
* **Markdown/MDX:** ....... as source format
* **Mermaid:** ............ diagrams; Mermaid is text-defined and works naturally 
                            in Markdown contexts, including Mermaid code blocks 
                            in GitHub-supported Markdown surfaces. 
* **Changesets:** ......... monorepo versioning and changelogs; it is explicitly 
                            focused on monorepos and coordinated multi-package 
                            versioning.
* **Playwright:** ......... docs-portal smoke tests and search/editorial 
                            regression checks; Playwright Test supports Chromium, 
                            WebKit, and Firefox and is designed for modern web 
                            apps. 
* **Pagefind first:** ..... self-hosted static search; it runs after static site 
                            build, creates a static search bundle, and does not 
                            require search infrastructure. 
* **Algolia DocSearch:** .. later if needed; stronger hosted search; Docusaurus 
                            has official search integration support. 
* **Decap CMS now:** ...... with the understanding that it may be swapped later; 
                            Decap is a Git-based CMS designed to work with static 
                            site generators and offers editorial workflow mode.

## The most important architectural decision

There are two possible ways to implement this:

### Option A — docs live inside the Docusaurus app

This is simpler at first, but it will fight our automation wants.

### Option B — docs remain canonical outside the app, and Docusaurus consumes them

This is the option we will be taking because we already had:

* `docs/ai` or `.ai`
* continuity/context artifacts
* a docs-engine that automated parts of documentation

We want to keep **content and automation separate from presentation**.

The mental model is:

> **repo content system** → canonical source of truth
> **docs-engine** → generates, validates, syncs, compiles context
> **Docusaurus** → renders and publishes

That preserves continuity and keeps us from rebuilding the same ideas twice.

## Repo Shape

```text
.
├── apps/
│   ├── web/
│   ├── gov-api/
│   └── knowledge/                     # Docusaurus portal (previously 'cms')
├── docs/
│   ├── ai/                            # keep this canonical
│   │   ├── README.md
│   │   ├── context/
│   │   ├── prompts/
│   │   ├── inventories/
│   │   ├── manifests/
│   │   ├── continuity/
│   │   └── handoffs/
│   ├── architecture/
│   ├── domain/
│   ├── product/
│   ├── runbooks/
│   ├── adr/
│   ├── api/
│   └── project/
├── journal/
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
│       ├── src/
│       ├── snapshots/
│       ├── templates/
│       └── output/
├── .changeset/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── PULL_REQUEST_TEMPLATE.md
└── README.md
```

## What each area means...

### `docs/`

Stable truth. This is the canonical engineering and product documentation.

### `docs/ai/`

For our workflow, this is not fluff; it is part of the system. This will remain 
the canonical home for:

* project context
* continuity summaries
* implementation prompts
* repo state summaries
* canonical manifests
* generated inventories
* AI handoff packets
* “what an implementation agent needs to know”

### `journal/`

Raw engineering diary. Day-by-day build log.

### `blog/`

Polished outward-facing writing. This can draw from the journal later.

### `tools/docs-engine/`

The automation brain; it will continue owning things like:

* repo inventory
* changed-file analysis
* impacted-doc detection
* context compilation
* drift detection
* required-doc validation
* AI handoff generation
* maybe promotion pipelines from journal/dev notes into formal docs

### `apps/knowledge/`

The published portal. This will **import or mirror** content from the canonical 
folders instead of becoming the canonical store itself.

## How Docusaurus will be used here...

Docusaurus will be our **knowledge frontend**, not our source-of-truth backend. 
Its job is to expose:

* Docs
* Journal
* Blog
* ADRs
* Changelog
* Roadmap
* AI context docs if we decide we want some of them visible internally

Docusaurus provides official docs and blog content plugins, and supports multiple 
docs plugin instances, which is useful as we want separate sections such as 
“Docs,” “Journal,” and “ADRs” with separate sidebars or behavior. 

We will configure it roughly as:

* one docs instance for `docs/`
* one docs instance for `journal/`
* built-in blog for `blog/`
* one docs instance for `docs/ai/` as we want an internal-only AI context section

## How Decap will fit in...

Since I already expect editing pain to be coming, I'm thinking that Decap will be 
a reasonable bridge.

Decap is Git-backed and built to work with static site generators, while keeping 
content in the repo next to code. It also supports an editorial workflow mode 
rather than committing everything directly to the main branch. 

For now, I plan to use Decap **only for content domains where UI editing is 
actually helpful**:

* blog posts
* journal entries
* roadmap/status updates
* non-technical product docs

These will **not** go under Decap editing:

* `docs/ai/`
* architecture docs with lots of cross-references
* generated docs-engine outputs
* schemas, manifests, or handoff packets

Those will remain code-review-first and automation-safe.

So the split is:

**Decap-managed**

* blog
* journal
* selected docs pages

**Git-only**

* `docs/ai`
* `tools/docs-engine`
* generated artifacts
* architecture-critical docs
* machine-readable manifests

## How Pagefind fits in...

Pagefind will be treated as a **post-build indexer** for the knowledge portal. 
It runs after the static site is built and generates a static search bundle. 
That is exactly why it is a good stage-one choice for a self-hosted portal. 

That means our initial pipeline becomes:

1. Build Docusaurus static site
2. Run Pagefind against the built output
3. Publish the augmented static output

Later, if we outgrow it, we can swap the search layer without restructuring 
the content system.

## How Changesets fits in...

Changesets will not only version code packages; in the repo, it will also become 
part of the release documentation rhythm, with a healthy release flow of:

1. code changes merged
2. changeset added for relevant packages/apps
3. version/release PR generated
4. changelog updated
5. Docusaurus docs version cut when appropriate
6. journal milestone entry written
7. release blog post optionally generated

Changesets explicitly separates “adding a changeset” from “versioning and 
changelog generation,” which is a good fit for disciplined solo work.

## How Playwright fits in...

Playwright will test the **knowledge system**, not just the product. I will add 
smoke tests for:

* docs home loads
* search UI renders
* key docs routes resolve
* Mermaid-heavy pages render without breaking layout
* Decap admin route loads
* blog index loads
* a representative journal page loads
* no critical JS errors on docs pages

Playwright’s multi-browser support makes it a good fit for catching fragile 
frontend regressions in the portal itself.

## How GitHub Issues and Projects fit in...

I'll use GitHub Projects as the actual execution layer for the rebuild and the 
content system. GitHub Projects supports table, board, and roadmap views tied to 
issues and pull requests, and sub-issues can represent decomposed task trees.

Here are the initial epics:

* Knowledge Portal
* Docs Engine Reintegration
* AI Continuity System
* Search
* Editorial Workflow
* Release System
* Documentation Taxonomy
* Journal / Blog Workflow

And then sub-issues under each.

## What will survive from the old system...

### 1. `docs/ai` as a first-class subsystem

- visible and formal
- part of our delivery machinery

### 2. docs-engine as an actual tool

- not reduced to a script folder
- it is a real internal product

### 3. context continuity artifacts

- project context
- repo blueprint
- architecture summary
- current state summary
- implementation manifests
- handoff prompts
- inventories

### 4. the promotion pipeline

This is where the old and new systems combine nicely:

* raw work starts in journal / issues
* decisions become ADRs
* stable truths become docs
* machine summaries become `docs/ai`
* public highlights become blog posts

## Operating model...

Think of it as five connected layers:

### Layer 1 — execution

GitHub Issues / Projects

### Layer 2 — raw narrative

`journal/`

### Layer 3 — stable knowledge

`docs/`

### Layer 4 — AI continuity

`docs/ai/` + `tools/docs-engine/`

### Layer 5 — presentation

`apps/knowledge/`

## Initial implementation order...

1. Recreate the canonical folder structure:

   * `docs/`
   * `docs/ai/`
   * `journal/`
   * `blog/`
   * `tools/docs-engine/`
   * `apps/knowledge/`

2. Stand up Docusaurus in `apps/knowledge/`

3. Wire Docusaurus to consume content from canonical repo folders rather than 
   inventing a separate content universe

4. Add Pagefind post-build indexing

5. Add Playwright smoke tests for the knowledge portal

6. Add Changesets

7. Add Decap, initially narrowly scoped to journal/blog/selected docs

8. Reintroduce docs-engine automation, especially:

   * repo inventory
   * changed-file analysis
   * context compilation
   * drift checks
   * AI handoff generation

9. Create the GitHub Project and epics/sub-issues

10. Start refining editorial UX and search relevance

## Here be dragons...

We must intentionally be careful and on guard to **not** let Decap or Docusaurus 
become the owner of our automation model. The ownership model should remain:

* repo content is canonical
* docs-engine governs automation and continuity
* Docusaurus renders
* Decap edits selected content surfaces
* Pagefind indexes output
* Playwright validates

That separation gives us room to later swap:

* Decap → Tina
* Docusaurus → Astro/Starlight
* Pagefind → Algolia

without destroying the underlying knowledge system.

The next step in getting started is to turn all the above into a **concrete monorepo 
scaffold and implementation plan** for the exact folders, files, package names, 
scripts, and workflow wiring.