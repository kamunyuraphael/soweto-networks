# Soweto Network portal

Captive-portal UI for Soweto Network Wi-Fi, rebuilt to match the original site: package
grid, "How to purchase" instructions, and a three-way reconnect (voucher, M-Pesa code,
username & password). React 19 + Vite + Tailwind CSS v4 + TypeScript, structured as MVC.

```bash
npm install
npm run dev        # http://localhost:5173 with the mock API
npm run build      # typecheck + production build into dist/
```

## Layout

One page (`HomePage`) with the instructions card, "Login / Activate Package" button,
free-trial banner, and package grid — always visible underneath. Every flow (pay, wait,
reconnect, errors) is a dialog on top of it, the same way the original site works.

## MVC map

| Layer | Folder | Responsibility |
|---|---|---|
| Model | `src/models`, `src/services`, `src/lib` | Types, package catalog, API contract and clients, pure helpers (phone, formatting) |
| View | `src/views` | `pages/HomePage`, `dialogs/*`, `components/*`. Render props, call callbacks. No API calls, no business rules |
| Controller | `src/controllers` | `portalReducer` (the journey as a state machine) and `usePortalController` (effects: API calls, polling, storage) |
| Config | `src/config/site.ts` | Brand name, support numbers, trial length, payment timings |

Data flows one way: `View --actions--> Controller --calls--> Model/services --> state --> View`.

```
src/
├─ config/site.ts
├─ models/            package.ts  catalog.ts  session.ts  payment.ts  login.ts  device.ts
├─ services/          portalApi.ts (contract)  httpPortalApi.ts  mockPortalApi.ts  index.ts
├─ lib/               phone.ts  format.ts  storage.ts  mac.ts
├─ controllers/       portalReducer.ts  usePortalController.ts  usePortalNotice.ts  useElapsedSeconds.ts
├─ views/
│  ├─ PortalView.tsx  (state -> dialog, over HomePage)
│  ├─ copy.ts         (failure messages)
│  ├─ pages/          HomePage.tsx
│  ├─ dialogs/        Payment  Waiting  Connecting  Connected  Failed  Reconnect  Login
│  │                  TvIntro  TvPickDevice  TvManualMac  TvChoosePackage
│  └─ components/     Button  Modal  Icon  TextField  OptionRow  StepList  PackageGrid
│                     InstructionsCard  TrialBanner  PageHeader  PhoneLink  StatusBanner  Spinner
├─ App.tsx  main.tsx  index.css (design tokens)
```

## The journey (state machine)

```
idle -> paying -> requesting -> waiting (pin -> connecting) -> connected
  |        ^                          |
  |        +------ Try again ---------+-> failed
  +-> reconnect -> login(voucher | mpesa | credentials) -> connected
  +-> tvIntro -> tvPickDevice   \
              -> tvManualMac     +-> tvChoosePackage -> paying (device attached) -> ...
```

"Add a TV or device" identifies a device (from a nearby-device scan, or a typed MAC
address), then feeds it into the normal package-and-payment flow: `paying`, `requesting`
and `waiting` all carry an optional `device: { mac, label }`, so the payment dialog and
the final "You are online" screen both show which device the plan is for.

## Try every screen without a backend

The dev server uses `mockPortalApi`. Outcomes are picked by what you type:

| Input | Result |
|---|---|
| M-Pesa number ending `0000` | Payment cancelled |
| `1111` | Wrong PIN |
| `2222` | Not enough balance |
| `3333` | Never answers, times out after 90s |
| `4444` | Paid, but hotspot login fails once — "Try again" then works |
| any other number | Success after about 6 seconds |
| Voucher / M-Pesa code ending `0000` | Not found |
| ending `9999` | Already used / expired |
| any other code (8–12 letters/digits) | Success |
| Username & password, password `wrong` | Invalid credentials |
| username `expired` | Package already ended |
| any other username & password | Success |

Add `?down` to the URL to show the red "network service is not responding" banner.

## Backend contract

Implemented by `httpPortalApi.ts`:

| Method and path | Body | Returns |
|---|---|---|
| `GET /api/portal/status` | | `{ notice: string \| null }` |
| `POST /api/portal/trial` | | `Session` |
| `POST /api/portal/payments` | `{ packageId, phone, device? }` (phone as `2547XXXXXXXX`; `device` is `{ mac, label }` when paying for a TV or other device) | `{ paymentId }` (sends the STK push) |
| `GET /api/portal/payments/:id` | | `{ status: 'pending' \| 'success' \| 'cancelled' \| 'wrong_pin' \| 'insufficient_funds' \| 'failed' }` |
| `POST /api/portal/payments/:id/activate` | | `Session` (logs the device into the hotspot) |
| `POST /api/portal/login` | `LoginInput` (see `models/login.ts`) | `Session`, or 4xx `{ code: 'not_found' \| 'used_or_expired' \| 'invalid_credentials' }` |
| `GET /api/portal/devices/nearby` | | `NetworkDevice[]` — other devices currently on this Wi-Fi |

`Session = { packageName, expiresAt (ISO 8601), redirectUrl?, deviceLabel? }`. `deviceLabel`
is set when the session belongs to a device added via "Add a TV or device".

Notes:
- The catalog in `models/catalog.ts` is display data. The backend must be the source of truth for prices.
- Production builds default to the real API. Set `VITE_USE_MOCK=true` to force the mock.
- `site.support.phones` accepts more than one number; each gets its own numbered step in the instructions card.

## Captive-portal constraints (why some choices look plain)

- System fonts only. Web fonts are blocked before login unless whitelisted in the walled garden.
- Inline SVG icons, no icon fonts, no images, no external requests. About 82 KB gzipped in total.
- `localStorage` is wrapped in try/catch because captive browsers often block it.
- `base: './'` in `vite.config.ts` so the build works from any path on the portal server.
- Tailwind v4 needs Chrome 111+ / Safari 16.4+ WebViews. Test on your oldest customer phone. If it fails there, Tailwind 3.4 is the fallback.

## Roadmap

1. Real-device test inside the captive-portal pop-up (Android and iPhone) on the actual hotspot.
2. Build the backend endpoints above; swap the mock for HTTP.
3. Real device identification: `GET /api/portal/devices/nearby` needs to read the router's
   DHCP lease table or ARP cache to list what's actually on the Wi-Fi (the mock returns a
   fixed list). Vendor-name lookup from the MAC's OUI prefix is a nice-to-have for `label`.
4. Unit tests for `portalReducer`, `lib/phone.ts`, `lib/mac.ts` and `models/login.ts` (all
   pure), then Playwright for the payment, reconnect, and TV-device flows.
