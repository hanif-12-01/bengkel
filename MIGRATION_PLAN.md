# SIMOBS Migration Plan

## Source Inspection Summary

Original customer app (`temp_extract/simobs-java`) used Spring MVC templates and Firestore collections:
- `users` with plaintext `password`, `nama`, `email`, `no_hp`, `created_at`.
- `bookings` for customer-created booking data.
- `notifikasi` for booking and status notifications.
- `promo` read from the admin database.
- OTP login via email, but OTP had no expiry in the original controller.

Original admin app (`temp_extract/simobs-admin`) used Spring + React admin pages and Firestore collections:
- `admins` with plaintext `password`.
- `pelanggan` for manual customers.
- `sparepart` for stock management.
- `booking` as an admin-side mirror of customer `bookings`, linked by `user_booking_id`.

## Rebuild Decisions

1. Replace plaintext passwords with PBKDF2 password hashes in the app adapter and API shim.
2. Replace session OTP storage with hashed OTP records that expire after 5 minutes.
3. Use a canonical `bookings` collection instead of separate customer/admin mirrors. Admin and customer views read the same record, so status updates are immediately visible to customers.
4. Preserve original Indonesian field names and status values: `Menunggu`, `Diproses`, `Selesai`, `Ditunda`.
5. Keep registered customers visible in admin customer management by deriving rows from `users` and marking them as `Registrasi`.
6. Keep manual customers in `pelanggan`, editable/deletable only when `source = admin`.
7. Generate customer notifications when a booking is created and when admin changes status.
8. Move vehicle profile from old localStorage-only behavior into the `users.vehicle_profile` object.
9. Replace old mobile-only template UI with responsive customer and admin shells.
10. Add PWA, Tauri, and Capacitor configuration for cross-platform packaging.

## Data Model Mapping

- `users.password` -> `users.password_hash`
- admin `booking` mirror -> canonical `bookings` with `source`
- old `user_booking_id` -> same booking `id`
- profile motor localStorage -> `users.vehicle_profile`
- `notifikasi.dibaca` preserved
- `sparepart` category/stock/harga preserved

## Production Migration Steps

1. Export old Firestore data.
2. For each user/admin, require password reset or run a one-time password migration if legally and technically appropriate. Do not keep plaintext passwords.
3. Merge admin `booking` documents into canonical `bookings` by matching `user_booking_id`.
4. Backfill `source`, `updated_at`, `nama_pelanggan`, `user_id`, and `user_email` fields.
5. Move profile vehicle data into `vehicle_profile` when available.
6. Deploy backend with secrets in environment variables or a secret manager.
7. Deploy Firestore rules and indexes.
8. Verify role flows: customer register/login/OTP/booking/status and admin booking update/notification sync.
