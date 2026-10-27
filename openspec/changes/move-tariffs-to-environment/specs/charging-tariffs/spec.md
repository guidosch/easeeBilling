# Spec Delta

## Purpose

Defines how hourly charger consumption is classified into high-rate, low-rate and solar-eligible energy and priced, using a dated tariff configuration maintained alongside the application build.

## ADDED Requirements

### Requirement: Dated tariff configuration
The system SHALL read tariffs from the build environment configuration as a list of entries, each with a start date (`validFrom`), a high rate and a low rate in CHF/kWh, the hours of day billed at the high rate, the weekdays on which those high-rate hours apply, and the hours of day eligible for solar. A tariff applies from the start of its `validFrom` day (Europe/Zurich) until the next tariff's `validFrom`.

#### Scenario: Latest started tariff applies
- **WHEN** tariffs start on 2023-12-28 and 2025-02-24 and an entry is dated 2025-03-10
- **THEN** the 2025-02-24 tariff is applied to that entry

#### Scenario: Tariff boundary at midnight
- **WHEN** a tariff starts on 2025-02-24 and an entry starts at 2025-02-23 23:00 Europe/Zurich
- **THEN** the previous tariff is applied to that entry

#### Scenario: Historical tariffs are available
- **WHEN** the application is built
- **THEN** the configuration contains the tariffs starting 2022-12-28 (40.77/14.49 Rp./kWh), 2023-12-28 (39.47/14.85 Rp./kWh) and 2025-02-24 (41.22/16.62 Rp./kWh)

### Requirement: Hour classification in Swiss local time
The system SHALL classify each hourly consumption entry by the hour of its start time in the Europe/Zurich timezone, independent of the browser's locale and timezone. An entry is high-rate when that hour is in the applicable tariff's high-rate hours and its Europe/Zurich weekday is in the tariff's high-rate days, and solar-eligible when it is in the tariff's solar hours; otherwise it is low-rate and not solar-eligible.

#### Scenario: High-rate hour
- **WHEN** the applicable tariff lists 11 as a high-rate hour and an entry starts at 11:00 Europe/Zurich
- **THEN** the entry is classified as high-rate

#### Scenario: Sunday is low rate all day
- **WHEN** the applicable tariff lists 11 as a high-rate hour and Monday–Saturday as high-rate days, and an entry starts on a Sunday at 11:00 Europe/Zurich
- **THEN** the entry is classified as low-rate and solar-eligible

#### Scenario: Hour outside configured lists
- **WHEN** an entry starts at 22:00 Europe/Zurich and 22 is in neither list
- **THEN** the entry is classified as low-rate and not solar-eligible

#### Scenario: Browser locale does not matter
- **WHEN** the browser uses a 12-hour locale such as en-US and an entry starts at 18:00 Europe/Zurich with 18 listed as a high-rate hour
- **THEN** the entry is classified as high-rate

#### Scenario: Browser timezone does not matter
- **WHEN** the browser runs in UTC and an entry starts at 10:00 UTC (12:00 Europe/Zurich in summer) with 12 listed as a high-rate hour
- **THEN** the entry is classified as high-rate

### Requirement: Per-entry cost calculation
The system SHALL compute a charger's period cost as the sum over its consumption entries of energy multiplied by the high or low rate of the tariff applicable to each entry, and SHALL report total high-rate kWh, low-rate kWh and solar-eligible kWh for the period.

#### Scenario: Period spans a tariff change
- **WHEN** a billing period contains 1 kWh low-rate before a tariff change at 14.85 Rp./kWh and 1 kWh low-rate after it at 16.62 Rp./kWh
- **THEN** the period cost is 0.3147 CHF

#### Scenario: Zero consumption entries
- **WHEN** an entry has zero energy
- **THEN** it adds nothing to costs or kWh totals

### Requirement: Missing tariff is reported
The system SHALL NOT price consumption silently when no tariff applies to an entry's date; it SHALL notify the user that no tariff is configured for that date.

#### Scenario: Entry before the earliest tariff
- **WHEN** an entry is dated before the earliest configured `validFrom`
- **THEN** the user sees a notification naming the uncovered date and that entry is not priced

### Requirement: Displayed rates match the selected period
The system SHALL show the high and low rates in the billing table headers (in Rp./kWh, rounded) from the tariff applicable at the end of the selected billing period.

#### Scenario: Viewing a past period
- **WHEN** the user selects a month in 2024
- **THEN** the table headers show the 2023-12-28 tariff rates (39 Rp./kWh high, 15 Rp./kWh low)
