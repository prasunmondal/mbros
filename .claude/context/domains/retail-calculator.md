---
status: VERIFIED
last_verified: 2026-10-30
sources: [retail-calculator/retail-calculator.html, retail-calculator/retail-calculator-script.js, retail-calculator/sales-report.js, retail-calculator/retail-calculator.css, style.css]
---
# Retail calculator (retail-calculator/)

## Purpose
Counter tool for retail shopkeepers: set per-product rates once, then convert kg ↔ amount per sale, log sales on-device, view daily summaries, export PDFs. Builds goodwill/brand presence; no data leaves the device except telemetry events.

## UI (redesigned 2026-10-30, matches home page)
- Styles: shared `../style.css` (tokens, top bar, buttons, cards, footer) + `retail-calculator.css` (page-specific). Page has its own EN/বাং switch.
- Product tiles are `<button class="choice-btn" data-type="...">` showing the saved rate (`.tile-rate`); `.active` = selected.
- Settings (`#settingsModal`) and transactions (`#transactionModal`) dialogs are shown/hidden by JS via `style.display = "flex"/"none"`. Don't set `display: block` on flex/grid elements from JS — use `""` to fall back to CSS.
- JS-built text uses `tr(key)` (defined in `language.js`). Elements whose text JS changes (`#selectedTypeLabel`, `#reportToggleBtn`) also get their `data-translate` updated so language switches stay correct. Product type keys double as translation keys.

## Flows
1. **Settings** (gear icon / empty-state button) → 4 rate inputs → `saveSettings()` writes `rate_<type>`, tracks event, reloads page. Product buttons with no rate are hidden; calculator card hidden until any rate is set.
2. **Select type** → `setRate(type)` loads rate, stores `selectedType`.
3. **Calculate** → `autoCalc(changed)`: kg→amount (2 dp) or amount→kg (3 dp); edited rate is saved back to `rate_<type>`.
4. **Save** → `saveAndClearKgAmount()` → `logSale(...)` appends to `salesLog`.
5. **Report** → `showReport()` builds date × type kg table (types ordered by `preferredOrder`); clicking a cell opens transaction modal (`showTransactions`) with edit/delete/add.
6. **Download** → `downloadPdf("full" | daywise)` via jsPDF, titled with `shop_name`.

## Data — `salesLog` record
```json
{ "type": "broiler_cut", "kg": 1.25, "rate": 220, "amount": 275,
  "saleTimestamp": "2026-10-30T10:15:00.000+05:30",
  "recordTimestamp": "2026-10-30T10:15:02.123+05:30" }
```
- Timestamps: IST wall-clock with `+05:30` suffix (`getISTISOString`). `recordTimestamp` is the de-facto unique id (used by edit/delete).
- Modal-added entries use `saleTimestamp = {date}T00:00:00+05:30`.

## Constraints
- All data is per-device, unsynced, lost if browser storage is cleared (ADR-003).
- Product types are hardcoded in several places — see `known-issues.md` tech debt before adding one.
- UI strings use `lang.js` keys; PDF, alert/confirm/prompt text and transaction-time labels are still English-only.

## Related
`business.md` (terminology), `known-issues.md` #5–7, ADR-003
