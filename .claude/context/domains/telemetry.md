---
status: VERIFIED
last_verified: 2026-10-30
sources: [log-worker.js]
---
# Telemetry (log-worker.js)

## Purpose
Gives the owners visibility into who uses the site and what they do (orders, shares, calculator usage) without a backend (ADR-004).

## Event contract
`trackEvent(actionMsg)` queues to `localStorage.eventQueue`:
```json
{ "timestamp": "2026-10-30 10:15", "name": "<customerName>", "shop": "<shop_name>",
  "location": "<city, region, country>", "coords": "<lat,lon>", "action": "<free text>" }
```
Action strings are free text with prefixes by convention: `Clicked Header:`, `Clicked Order Online:`, `Prebooking:`, `Click: Refer …`, `RCalc: …`.

Flush payload (POST, `no-cors`, to the Apps Script `/exec` URL in `sendData`):
```json
{ "operations": [{ "opId": "<uuid>", "opCode": "INSERT_BATCH",
  "sheetId": "<sheet id>", "tabName": "webTrack", "objectList": [ ...events ] }] }
```
The Apps Script and Sheet are outside this repo; field names must match sheet columns.

## Location
GPS via `navigator.geolocation` (prompts user); on denial falls back to `ipapi.co`. Cached in `coords` / `user_location` once.

## Constraints
- **Privacy:** sends customer name, shop name and location. Any new field or recipient is a privacy change → ADR.
- `no-cors` means responses are opaque; success cannot be verified client-side.
- Triggers: interval timer + `beforeunload` (beacon). See `known-issues.md` #3.

## Related
ADR-004
