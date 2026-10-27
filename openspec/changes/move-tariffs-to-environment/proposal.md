# Proposal

## Why

Electricity rates and the high-rate/solar hours are hardcoded in `secure.component.ts` as a single `HIGH_RATE`/`LOW_RATE` pair and a string `switch`. Rates change on specific dates (2022-12-28, 2023-12-28, 2025-02-24, and a 2026 change pending), so a single pair either bills past periods at new prices or new periods at old prices. The hour matching also depends on the browser locale (`toLocaleTimeString()`), so a non-24h locale silently bills everything at the low rate.

## What Changes

- Introduce a dated tariff list in `src/environments/environment.ts` and `environment.prod.ts`. Each entry has `validFrom`, `highRate`, `lowRate`, `highRateHours` and `solarHours`.
- Seed the list with the historical tariffs currently recorded as comments in `secure.component.ts`.
- Classify each hourly usage entry using the tariff in effect at that entry's timestamp, so a billing period that spans a tariff change is split correctly.
- Determine the hour of an entry numerically in the `Europe/Zurich` timezone instead of matching locale-dependent time strings.
- Compute costs per entry with that entry's tariff rate instead of global constants.
- Show the rates in the table headers from the tariff in effect at the end of the selected period.
- Remove the `HIGH_RATE`/`LOW_RATE` constants and the hardcoded hour `switch`.
- Document in `README.md` and `CLAUDE.md` how to add a new tariff.

Out of scope: weekend/holiday low-rate rules, pricing solar energy, runtime-loaded config (`.env` or assets JSON).

## Capabilities

### New Capabilities
- `charging-tariffs`: How hourly charging consumption is classified into high/low rate and solar-eligible energy and priced, based on a dated tariff configuration.

### Modified Capabilities
<!-- none: no specs exist yet -->

## Impact

- `src/environments/environment.ts`, `src/environments/environment.prod.ts`: new `tariffs` configuration.
- `src/app/secure/secure.component.ts`: `checkTimeForHighRate`, `sumCosts`, `getHighRate`, `getLowRate`; removal of rate constants.
- `src/app/Chargers.ts`: `PowerUsage` may carry the applied rate per entry.
- `src/app/secure/secure.component.spec.ts`: tests that spy on `toLocaleTimeString` need rewriting against real timestamps.
- `README.md`, `CLAUDE.md`: tariff maintenance documentation.
- No new dependencies (dayjs with utc/timezone plugins is already used).
