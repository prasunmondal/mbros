# ADR-003: localStorage as the only persistence

- **Status:** accepted (backfilled 2026-10-30; rationale inferred — confirm with owner)
- **Date:** unknown

## Context
No backend (ADR-001/002), yet the site must remember language, name, rates and the shopkeeper's sales log.

## Decision
All app state is stored in browser `localStorage` under flat keys (registry in `architecture.md`).

## Alternatives considered
- IndexedDB — more capable, more code; data volumes are small.
- Cloud sync — requires backend/auth.

## Consequences
+ Works offline, zero cost, private by default.
− Per-device only; lost on clearing storage/uninstall; ~5 MB limit; no backup of sales logs.

## Constraints for future work
Register every new key in `architecture.md`. Never rename an existing key without a migration (users' stored data would be orphaned). Sending sales data off-device requires a new ADR.

## Related
`architecture.md`, `domains/retail-calculator.md`
