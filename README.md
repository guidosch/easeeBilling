# EaseeBilling

Angular project which connects to the easee.cloud API to fetch hourly data.

## How to run locally

`npm run start`

## How to build

`npm run build`

or...

`node_modules/@angular/cli/bin/ng build --base-href /easeeBilling/`

This only works if you choose /docs as option in the github pages settings (output path /docs in angular.json).

## How to add new user

To map a user to a charger a local file (not part of git) with name: ChargersWithUsers.ts exists
which maps users<-->chargers. Who own which parking place you have to look up in the google sheet:

https://docs.google.com/spreadsheets/d/13plMGXFHiAvkXurg8AWaQc1nDqQ9Gkpngp1IN4bYU38/edit?gid=0#gid=0

The user id can be found in the allUsers.json export (locally or see response from easee cloud webpage: getusers, getSite to get site ID)

## Angular ng binary
`node_modules/@angular/cli/bin/ng`

## OpenSpec installed. See Claude.md file for skills
