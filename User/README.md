# SIMOBS - Sistem Booking Servis Bengkel

A rebuilt cross-platform SIMOBS application based on the inspected `simobs-java` customer app and `simobs_admin` workshop/admin app in `temp_extract/`.

## What Was Rebuilt

- Customer authentication with email/phone login, password hashing, expiring OTP verification, session handling, register, and logout.
- Customer dashboard, booking flow, service history, status tracking, booking detail, notifications, profile, settings, and sparepart catalog.
- Admin authentication, dashboard, customer management, booking management, sparepart management, and admin account list.
- Shared Firestore-shaped data model for `users`, `admins`, `bookings`, `pelanggan`, `sparepart`, `notifikasi`, and `promo`.
- Time-based theme system using `data-theme` on the root element.
- Responsive layouts for mobile, tablet, desktop, PWA, Tauri, and Capacitor packaging.

## Architecture

```text
src/
  components/          reusable UI components
  components/layout/   role-aware app shell, sidebar, mobile nav, topbar
  context/             session, toast, and theme provider
  data/                sparepart catalog and seed data
  pages/               auth, customer, and admin route screens
  services/            SIMOBS service adapter, auth, OTP, business logic
  types.ts             Firestore-compatible domain model
server/
  index.mjs            local Node API shim with requested endpoint paths
public/
  manifest.webmanifest PWA manifest
  sw.js                offline cache service worker
src-tauri/             Tauri desktop shell config
```

The frontend currently runs with a local secure adapter so it is usable without Firebase credentials. Passwords are stored as PBKDF2 hashes and OTP values are stored as hashes with expiry. The local demo displays the OTP after login because no SMTP provider is configured; production should send OTP through backend email.

## Setup

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

Customer flow:
1. Register a customer at `/register`.
2. Login at `/login` with email or phone.
3. Enter the displayed local demo OTP.
4. Use `/app/dashboard`.

Admin flow:
1. Register an admin at `/admin/register`.
2. Login at `/admin/login`.
3. Use `/admin/dashboard`.

## Build Commands

```bash
npm run build
npm run preview
```

## Local API Command

```bash
npm run api
```

The local API runs on `http://localhost:8787` and persists data in `server/data/simobs.local.json`.

## Desktop Build Command

Install Tauri prerequisites and CLI first, then run:

```bash
npm run desktop:build
```

## Mobile Build Commands

Install Capacitor packages first, add the target platform, then sync:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap add android
npm run mobile:android
```

For iOS on macOS:

```bash
npx cap add ios
npm run mobile:ios
```

## Firebase / Firestore Setup Notes

Use `.env.example` as the template. Do not commit real service account JSON or private keys.

Recommended production setup:
- Firebase Auth or backend-only PBKDF2/Argon2/bcrypt password verification.
- Firestore collections matching `src/types.ts`.
- Cloud Functions or Node/Express API implementing the same routes as `server/index.mjs`.
- SMTP provider or transactional email service for OTP delivery.
- Firestore security rules enforcing:
  - Customers can read/write only their own user document, bookings, and notifications.
  - Admins can read/write operational collections.
  - Password hashes and secrets are never readable by clients.

## API Surface

Auth:
- `POST /auth/customer/register`
- `POST /auth/customer/login`
- `POST /auth/customer/verify-otp`
- `POST /auth/admin/register`
- `POST /auth/admin/login`
- `POST /auth/logout`
- `GET /auth/session`

Customer:
- `GET /customer/dashboard`
- `GET /customer/profile`
- `PUT /customer/profile`
- `POST /customer/bookings`
- `GET /customer/bookings`
- `GET /customer/bookings/:id`
- `GET /customer/status`
- `GET /customer/notifications`
- `PATCH /customer/notifications/:id/read`
- `GET /customer/spareparts`
- `GET /customer/spareparts/:category`

Admin:
- `GET /admin/dashboard`
- `GET /admin/admins`
- `GET /admin/pelanggan`
- `POST /admin/pelanggan`
- `PUT /admin/pelanggan/:id`
- `DELETE /admin/pelanggan/:source/:id`
- `GET /admin/bookings`
- `POST /admin/bookings`
- `GET /admin/bookings/:id`
- `PUT /admin/bookings/:id`
- `DELETE /admin/bookings/:id`
- `GET /admin/spareparts`
- `POST /admin/spareparts`
- `PUT /admin/spareparts/:id`
- `DELETE /admin/spareparts/:id`
