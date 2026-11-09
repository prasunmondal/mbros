# ADR-001: Static vanilla site, no build step

- **Status:** accepted (backfilled 2026-10-30 from code; rationale inferred — confirm with owner)
- **Date:** 2024-02-12 (repo creation)

## Context
Small business site maintained by one person, hosted free on GitHub Pages.

## Decision
Plain HTML/CSS/JS, global scripts, no bundler, framework or package manager. Third-party libs via CDN.

## Alternatives considered
- React/Vue + bundler — overhead disproportionate to two pages.

## Consequences
+ Zero tooling; edit and push. + Fast load on low-end phones.
− No modules → global name collisions; no type checks, tests or linting.

## Constraints for future work
Don't add a build step or framework without superseding this ADR. Keep relative paths so the site works from any base path.

## Related
`architecture.md`
