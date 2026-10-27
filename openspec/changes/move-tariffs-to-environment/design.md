# Design

## Context

See proposal.md - Why. Today `loadData()` passes each charger's `PowerUsage[]` through `checkTimeForHighRate()` (sets `highRate`/`solarPower` flags from a `toLocaleTimeString()` string `switch`) and then `sumCosts()` (multiplies by the global `HIGH_RATE`/`LOW_RATE`). Both are exported pure functions with unit tests in `secure.component.spec.ts`. `environment.ts` is swapped for `environment.prod.ts` at production build via `fileReplacements`. dayjs with the `utc` and `timezone` plugins is already a dependency and is extended in `ngOnInit`.

## Goals / Non-Goals

**Goals:**
- Adding a tariff is a data-only edit followed by a rebuild.
- Classification and pricing stay pure, testable functions with no locale/timezone dependence.

**Non-Goals:**
- Changing the CSV export columns or format.
- Validating the tariff list at runtime beyond the "no tariff applies" case.

## Decisions

### Tariff shape in a shared module, re-exported by both environment files
```ts
export interface Tariff {
  validFrom: string;        // 'YYYY-MM-DD', start of day Europe/Zurich
  highRate: number;         // CHF/kWh
  lowRate: number;          // CHF/kWh
  highRateHours: number[];  // start hours 0-23
  highRateDays: number[];   // weekdays 0-6 (0 = Sunday) on which highRateHours apply
  solarHours: number[];     // start hours 0-23
}
```
The list lives in `src/environments/tariffs.ts`; `environment.ts` and `environment.prod.ts` both set `tariffs` from it.
*Why:* dev and prod must bill identically; duplicating the list invites drift. *Alternative:* full copy in each file, rejected for that reason. Code reads `environment.tariffs`, so a future per-environment override stays possible.

Hours are explicit lists (e.g. `highRateHours: [11, 12, 18, 19]`, `solarHours: [9, 10, 11, 12, 13, 14, 15]`) rather than ranges, because the current high-rate hours are non-contiguous. High-rate hours apply only on `highRateDays` (`[1, 2, 3, 4, 5, 6]`, Monday–Saturday); Sunday is low rate all day. Solar hours apply every day. The seeded values reproduce today's `switch` exactly for all three historical tariffs (the old hours were never recorded per tariff).

### Tariff lookup: sorted, latest `validFrom <= entry start`
A pure `findTariff(tariffs, instant)` sorts by `validFrom` descending and returns the first whose start (`dayjs.tz(validFrom, 'Europe/Zurich')`) is not after the instant, or `undefined`. The list is tiny, so no caching is needed.

### Classification attaches the tariff to the entry
`checkTimeForHighRate(powerUsage, tariffs)` computes `hour` and `weekday` from `dayjs(entry.from).tz('Europe/Zurich')`, looks up the tariff, and sets `highRate`, `solarPower` and a new `rate: number | undefined` on `PowerUsage` (the CHF/kWh actually applied). `sumCosts()` then uses `entry.rate` and no longer knows about tariffs.
*Why:* keeps `sumCosts` simple and makes the applied rate inspectable in tests and debugging. *Alternative:* passing tariffs to `sumCosts` and looking up again, rejected as duplicate work.

The timezone is fixed to `Europe/Zurich` because the tariffs belong to a Swiss utility, regardless of where the browser runs.

### Missing tariff
Entries without a tariff get `rate: undefined` and are skipped by `sumCosts`. `loadData()` collects their dates and calls `NotificationService` once per load with the earliest uncovered date. The 16-month chip range currently stays well within the 2022-12-28 start, so this is a guard rather than an expected path.

### Header rates
`getHighRate()`/`getLowRate()` use `findTariff(environment.tariffs, this.to)` (end of the selected period), falling back to the latest tariff before any period is selected.

## Risks / Trade-offs

- [The Easee `from` timestamp lacks an offset and would be parsed as browser-local time] -> Verify the format against a real response during implementation; if it has no offset, parse it explicitly as UTC with `dayjs.utc(...)`.
- [Hours of past tariffs may not match the real historical schedule] -> Accepted: they reproduce current billing behavior; correct the data if old invoices disagree.
- [DST days have 23/25 hours] -> Classifying by Zurich wall-clock hour handles both; the repeated 02:00 hour is classified twice the same way.
- [Rewritten tests lose the `toLocaleTimeString` spy approach] -> Tests use fixed ISO timestamps with explicit offsets, which is more realistic.

## Migration Plan

Rebuild and redeploy (`npm run build`). No data migration. Rollback means reverting the commit. Billing for current-tariff periods must produce identical totals before and after; compare one recent month's CSV export.

## Open Questions

- The 2026 tariff values ("tarife 2026 mit erster Rechnung anschauen") are added as a new list entry once known; this change does not need them.
