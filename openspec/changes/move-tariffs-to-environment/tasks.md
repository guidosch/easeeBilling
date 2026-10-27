# Tasks

## 1. Tariff configuration

- [ ] 1.1 Create `src/environments/tariffs.ts` with the `Tariff` interface and the three historical tariffs (2022-12-28, 2023-12-28, 2025-02-24) using today's hours (`highRateHours: [11, 12, 18, 19]`, `highRateDays: [1..6]` (Mon–Sat), `solarHours: [9..15]`); verify `npm run build` compiles
- [ ] 1.2 Add `tariffs` to `environment.ts` and `environment.prod.ts` from the shared module; verify both dev (`ng build --configuration development`) and prod builds compile

## 2. Tariff lookup and classification

- [ ] 2.1 Implement pure `findTariff(tariffs, instant)` (latest `validFrom` at or before the instant, start of day Europe/Zurich, `undefined` if none); verify with unit tests for mid-period, exact midnight boundary, previous-day 23:00 and before-earliest cases
- [ ] 2.2 Check the format of `PowerUsage.from` in a real Easee response (offset present or not) and parse it accordingly; record the finding in a code comment
- [ ] 2.3 Add `rate?: number` to `PowerUsage` in `Chargers.ts` and rewrite `checkTimeForHighRate(powerUsage, tariffs)` to use the Europe/Zurich hour and weekday and the entry's tariff; replace the `toLocaleTimeString` spy tests with fixed-offset ISO timestamps covering every configured hour, a Sunday high-rate hour (low rate), a default hour, a UTC-browser case and an entry before the earliest tariff; verify `npm test` passes

## 3. Pricing and display

- [ ] 3.1 Change `sumCosts` to use each entry's `rate` and skip entries without one; add a test for a period spanning a tariff change (expected 0.3147 CHF) and keep the existing zero-energy tests green; verify `npm test` passes
- [ ] 3.2 In `loadData`, pass `environment.tariffs` and notify the user once with the earliest uncovered date when entries have no tariff; verify with a component test that the notification is shown
- [ ] 3.3 Make `getHighRate`/`getLowRate` use the tariff applicable at the end of the selected period (latest tariff when nothing is selected); verify with a component test for a 2024 period showing 39/15
- [ ] 3.4 Remove `HIGH_RATE`, `LOW_RATE` and the rate history comments from `secure.component.ts`; verify `grep -rn "HIGH_RATE\|LOW_RATE" src` returns nothing

## 4. Documentation

- [ ] 4.1 Add a "How to update electricity tariffs" section to `README.md` (append an entry to `src/environments/tariffs.ts`, rebuild, deploy) and update the Billing Logic and Key Notes sections of `CLAUDE.md`; verify the documented file path and steps match the code

## 5. Integration check

- [ ] 5.1 Run `npm test` and `npm run build`, then bill one recent month (inside the 2025-02-24 tariff) in the running app and confirm the CSV totals match a pre-change export
