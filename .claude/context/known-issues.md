---
status: VERIFIED
last_verified: 2026-10-30
sources: [service-worker.js, language.js, log-worker.js, retail-calculator/retail-calculator.html, retail-calculator/retail-calculator-script.js, retail-calculator/sales-report.js, retail-calculator/retail-calc-lang.js, index.html]
---
# Known issues & technical debt

Keep entries short. Mark `FIXED (date)` rather than deleting for one cycle, then remove.

## Open bugs
| # | Issue | Where | Status |
|---|---|---|---|
| 1 | Missing comma in `urlsToCache` → SW syntax error, offline/PWA install broken. `lang.js`, `language.js`, `header-style2.css` not precached. | `service-worker.js` | OPEN |
| 2 | `switchLang` queries non-existent `#btnLangEn/#btnLangBn` → TypeError on every switch (after text is applied). | `language.js` | OPEN |
| 3 | `initLocation` defined twice; beacon path uses undefined `url`; flush every 1 s (comment says 5 min); `no-cors` send clears queue regardless of outcome. | `log-worker.js` | OPEN |
| 4 | Root-absolute `/pwa-installation.js` breaks under a sub-path host. | `retail-calculator/retail-calculator.html` | OPEN |
| 5 | Per-transaction delete filters on `entry.time` (field doesn't exist) → delete does nothing; function defined twice. | `sales-report.js` `deleteTransaction` | OPEN |
| 6 | `downloadPdf` defined twice (stub overridden by real impl); stub `downloadCsv` only logs. | `retail-calculator-script.js` | OPEN |
| 7 | `retail-calc-lang.js` never loaded; its keys already live in `lang.js`. | `retail-calculator/` | OPEN |

## Data inconsistencies
- Daily report groups by `recordTimestamp` date, but transaction modal and `deleteEntireDate` filter by `saleTimestamp` date. Back-dated entries added via modal can appear under a different day than expected.

## Needs owner confirmation
- IFSC shown as `CNRB0000000` looks like a placeholder (`index.html` bank card).
- Current deployment mechanism (see `architecture.md#deployment`).

## Technical debt
- No tests, linter, or README.
- Strings built in JS (WhatsApp messages, alerts, report/PDF) are English-only.
- Product types hardcoded in several places (settings modal, `rateKeys`, `preferredOrder`, `checkRatesAndToggleCalcCard`).
- Commented-out code blocks (`openUPILink`, old window.onload).
