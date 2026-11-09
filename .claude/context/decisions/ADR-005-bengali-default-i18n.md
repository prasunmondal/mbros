# ADR-005: Bilingual EN/BN via data attributes, Bengali default

- **Status:** accepted (backfilled 2026-10-30; rationale inferred — confirm with owner)
- **Date:** 2025-12 (introduced with "new site")

## Context
Most customers read Bengali; some prefer English.

## Decision
Single global `translations` dictionary in `lang.js`; elements declare `data-translate` / `data-translate-placeholder` keys; `switchLang` applies them. First visit defaults to `bn`; choice persisted in `siteLang`.

## Alternatives considered
- Separate pages per language — duplication.
- i18n library — conflicts with ADR-001.

## Consequences
+ Simple, shared across pages.
− `innerHTML` assignment (dictionary must stay trusted); JS-built strings bypass the system.

## Constraints for future work
Every new key must exist in both `en` and `bn`. Keep all keys in `lang.js` (one dictionary).

## Related
`architecture.md#i18n`
