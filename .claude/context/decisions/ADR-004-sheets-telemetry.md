# ADR-004: Usage telemetry via Google Apps Script → Google Sheet

- **Status:** accepted (backfilled 2026-10-30; rationale inferred — confirm with owner)
- **Date:** unknown

## Context
Owners want to know who uses the site and what they do, without running a server.

## Decision
Client queues events in `localStorage` and POSTs batches (`INSERT_BATCH`) to an Apps Script web app that appends to the `webTrack` tab of a Google Sheet.

## Alternatives considered
- Google Analytics — anonymous, no per-customer view.
- Own backend — contradicts ADR-001.

## Consequences
+ Free, owners read data in a spreadsheet.
− `no-cors` → no delivery confirmation; collects personal data (name, location) with no consent notice; Apps Script URL is public.

## Constraints for future work
Event fields must match sheet columns. Any new personal field or destination needs owner sign-off and an ADR update.

## Related
`domains/telemetry.md`
