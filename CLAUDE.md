# easeeBilling

An Angular 19 application for managing EV charger billing at the Tiechestrasse location. It fetches consumption data from the [Easee Cloud API](https://developer.easee.com/) and generates billing reports per charger/user.

## Architecture

- **Framework:** Angular 19 with Angular Material 19
- **Auth:** Native Easee API authentication (NOT Auth0) — username/password login against `https://api.easee.cloud/api/accounts/login`
- **API:** Easee Cloud API (`https://api.easee.cloud/api/`)
- **Key libraries:** RxJS, dayjs (with timezone/UTC plugins), lodash, angular-csv-ext

## Project Structure

```
src/app/
├── login/                  # Login page component
├── secure/                 # Main billing dashboard (protected route)
├── not-found/              # 404 page
├── auth.service.ts         # Login, logout, token refresh, user profile
├── auth.guard.ts           # Route guard — checks for refresh token
├── auth.interceptor.ts     # Adds Bearer token; handles 401 + token refresh
├── token.service.ts        # localStorage token read/write
├── easee-api.service.ts    # Easee API calls (consumption, permissions, products)
├── NotificationSerivce.ts  # MatSnackBar toast helper
├── date-validator.directive.ts  # Custom validator: no future dates
├── Chargers.ts             # Interface definitions
├── ChargersWithUsers.ts    # Charger→user mapping (NOT in git)
└── Products.ts / User.ts / Credentials.ts / LoginResponse.ts  # Models
```

## Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/` | → redirect `/secure` | — |
| `/login` | LoginComponent | — |
| `/secure` | SecureComponent | AuthGuard |
| `/404` | NotFoundComponent | — |
| `**` | → redirect `/404` | — |

## Authentication Flow

1. POST `/api/accounts/login` → receives `accessToken` + `refreshToken`
2. Tokens stored in `localStorage`
3. `AuthInterceptor` attaches `Authorization: Bearer <token>` to every request
4. On 401: interceptor attempts refresh via POST `/api/accounts/refresh_token`; on failure redirects to `/login`

## Easee API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /api/accounts/login` | Authentication |
| `POST /api/accounts/refresh_token` | Token refresh |
| `GET /api/accounts/profile` | Logged-in user info |
| `GET /api/accounts/products` | Sites/circuits/chargers for account |
| `GET /api/chargers/{id}/usage/hourly/{from}/{to}` | Hourly consumption data |
| `GET /api/chargers/{id}/permission` | Users with access to charger |

## Billing Logic (SecureComponent)

- **Role-based view:** UserRole 2 = site admin (sees all chargers); others see only their assigned chargers
- **Electricity rates (2025, CHF/kWh):**
  - High rate: `0.4122` (Monday–Saturday 11:00–13:00 and 18:00–20:00, i.e. hourly entries starting at 11, 12, 18, 19)
  - Low rate: `0.1662` (all other hours, and all of Sunday)
- **Solar tracking:** 09:00–16:00 (hourly entries starting at 9–15), every day
- Charger-to-user mapping lives in `ChargersWithUsers.ts` (manually maintained, excluded from git)
- Data loaded in parallel with `forkJoin()` across all chargers
- Exports CSV with title "Abrechnung Ladestationen Tiechestrasse"

## Commands

```bash
npm start        # Dev server (ng serve)
npm run build    # Production build
npm run watch    # Watch mode (development config)
npm test         # Karma + Jasmine tests
```

## Key Notes

- `ChargersWithUsers.ts` is intentionally not tracked in git (contains personal user data)
- Rate tiers and solar tracking windows are hardcoded in `secure.component.ts`
- Electricity prices may need updating yearly — search for `HIGH_RATE` / `LOW_RATE` constants
- Charger parking places are named PP01–PP37

## Openspec is installed with serveral skills

Openspec allows spec driven development but is more lightweight than SpecKit: https://openspec.dev/docs

It creates an /openspec folder and installs a few skills that are used in order:

| Skill | Job | Type |
|---|---|---|
| openspec-explore | Think through an idea before it becomes a change proposal | Core |
| openspec-propose | Create a change proposal with all its planning artifacts in one step | Core |
| openspec-apply-change | Implement a change proposal's tasks | Core |
| openspec-update-change | Revise a change proposal's plan | Core |
| openspec-sync-specs | Merge a change proposal's spec updates into specs/ | Core |
| openspec-archive-change | Move a finished change proposal to the archive | Core |
