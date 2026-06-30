-- Database setup untuk aplikasi booking bengkel
-- Import file ini melalui phpMyAdmin atau MySQL CLI XAMPP.

CREATE DATABASE IF NOT EXISTS `bengkel_app`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `bengkel_app`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255),
  `role` ENUM('customer', 'mechanic', 'admin') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_user_tokens_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX `idx_user_tokens_token` (`token`),
  INDEX `idx_user_tokens_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `vehicle_type` ENUM('mobil', 'motor') NOT NULL,
  `brand` VARCHAR(80) NOT NULL,
  `model` VARCHAR(80) NOT NULL,
  `year` INT NOT NULL,
  `plate_number` VARCHAR(30) NOT NULL,
  `current_mileage` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vehicles_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX `idx_vehicles_user_id` (`user_id`),
  INDEX `idx_vehicles_plate_number` (`plate_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vehicle_type` ENUM('mobil', 'motor') NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `description` TEXT,
  `min_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `max_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `estimated_duration` VARCHAR(80) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_vehicle_type` (`vehicle_type`),
  INDEX `idx_services_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workshops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `opening_hours` VARCHAR(120) NOT NULL,
  `status` ENUM('Aktif', 'Tutup Sementara', 'Tidak Aktif') NOT NULL DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_workshops_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(30) PRIMARY KEY,
  `user_id` INT NULL,
  `customer_name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120),
  `vehicle_id` INT NULL,
  `workshop_id` INT NULL,
  `booking_date` DATE NOT NULL,
  `booking_time` TIME NOT NULL,
  `complaint_note` TEXT,
  `estimated_min_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `estimated_max_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `status` ENUM(
    'Menunggu Konfirmasi',
    'Dikonfirmasi',
    'Kendaraan Diterima',
    'Sedang Dikerjakan',
    'Selesai',
    'Dibatalkan'
  ) NOT NULL DEFAULT 'Menunggu Konfirmasi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bookings_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_vehicle`
    FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_workshop`
    FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX `idx_bookings_user_id` (`user_id`),
  INDEX `idx_bookings_vehicle_id` (`vehicle_id`),
  INDEX `idx_bookings_workshop_id` (`workshop_id`),
  INDEX `idx_bookings_status` (`status`),
  INDEX `idx_bookings_date_time` (`booking_date`, `booking_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `booking_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(30) NOT NULL,
  `service_id` INT NULL,
  `service_name` VARCHAR(120) NOT NULL,
  `min_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `max_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_booking_services_booking`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_booking_services_service`
    FOREIGN KEY (`service_id`) REFERENCES `services`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX `idx_booking_services_booking_id` (`booking_id`),
  INDEX `idx_booking_services_service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(30) NULL,
  `message` TEXT NOT NULL,
  `channel` ENUM('system', 'whatsapp', 'email') NOT NULL DEFAULT 'system',
  `status` ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notification_logs_booking`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX `idx_notification_logs_booking_id` (`booking_id`),
  INDEX `idx_notification_logs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `workshops`
  (`id`, `name`, `address`, `phone`, `opening_hours`, `status`)
VALUES
  (1, 'Bengkel Pusat', 'Jl. Jenderal Sudirman No. 123, Bandung', '081122334455', '08:00 - 17:00', 'Aktif'),
  (2, 'Bengkel Cabang Timur', 'Jl. Soekarno Hatta No. 456, Bandung', '081122334456', '08:00 - 17:00', 'Aktif'),
  (3, 'Bengkel Cabang Barat', 'Jl. Raya Cibeureum No. 789, Bandung', '081122334457', '08:00 - 17:00', 'Aktif')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `address` = VALUES(`address`),
  `phone` = VALUES(`phone`),
  `opening_hours` = VALUES(`opening_hours`),
  `status` = VALUES(`status`);

INSERT INTO `services`
  (`id`, `vehicle_type`, `name`, `description`, `min_price`, `max_price`, `estimated_duration`, `is_active`)
VALUES
  (1, 'mobil', 'Ganti oli', 'Penggantian oli mesin, filter oli, dan pengecekan fluida dasar.', 350000, 500000, '45 menit', 1),
  (2, 'mobil', 'Servis berkala', 'Pemeriksaan menyeluruh sesuai kilometer dan rekomendasi pabrikan.', 650000, 1200000, '2 jam', 1),
  (3, 'mobil', 'Tune up', 'Pembersihan dan penyetelan komponen mesin agar performa kembali optimal.', 450000, 750000, '90 menit', 1),
  (4, 'mobil', 'Rem', 'Pengecekan kampas rem, minyak rem, cakram, dan sistem pengereman.', 250000, 500000, '60 menit', 1),
  (5, 'mobil', 'Aki', 'Pemeriksaan tegangan aki, sistem pengisian, dan penggantian bila diperlukan.', 650000, 1500000, '30 menit', 1),
  (6, 'mobil', 'AC mobil', 'Cek freon, filter kabin, evaporator, dan performa pendinginan.', 300000, 800000, '1 jam', 1),
  (7, 'mobil', 'Ban', 'Pengecekan tekanan, rotasi, tambal, dan penggantian ban mobil.', 150000, 1000000, '45 menit', 1),
  (8, 'mobil', 'Spooring balancing', 'Penyetelan sudut roda dan balancing untuk kenyamanan berkendara.', 300000, 500000, '90 menit', 1),
  (9, 'motor', 'Ganti oli', 'Penggantian oli mesin dan pengecekan ringan sebelum perjalanan.', 75000, 150000, '30 menit', 1),
  (10, 'motor', 'Servis ringan', 'Pembersihan, penyetelan, dan pengecekan komponen dasar motor.', 100000, 200000, '60 menit', 1),
  (11, 'motor', 'Servis CVT', 'Pembersihan CVT, pengecekan roller, v-belt, dan kampas ganda.', 120000, 250000, '1 jam', 1),
  (12, 'motor', 'Ganti ban', 'Penggantian ban, pentil, dan pengecekan tekanan angin.', 180000, 500000, '45 menit', 1),
  (13, 'motor', 'Rem', 'Pengecekan kampas rem, minyak rem, dan penyetelan rem.', 90000, 150000, '45 menit', 1),
  (14, 'motor', 'Aki', 'Pemeriksaan aki, kelistrikan, starter, dan penggantian aki.', 180000, 350000, '30 menit', 1),
  (15, 'motor', 'Busi', 'Pengecekan pembakaran dan penggantian busi motor.', 35000, 75000, '20 menit', 1),
  (16, 'motor', 'Rantai dan gear', 'Pembersihan, pelumasan, penyetelan, dan penggantian rantai gear.', 160000, 400000, '60 menit', 1)
ON DUPLICATE KEY UPDATE
  `vehicle_type` = VALUES(`vehicle_type`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `min_price` = VALUES(`min_price`),
  `max_price` = VALUES(`max_price`),
  `estimated_duration` = VALUES(`estimated_duration`),
  `is_active` = VALUES(`is_active`);

INSERT INTO `users`
  (`id`, `name`, `email`, `phone`, `password_hash`, `role`)
VALUES
  (1, 'Admin Bengkel', 'admin@bengkel.com', '081234567890', '$2y$10$kqiWAyBeoH/HjUVbtearne0fbu7tdZthcq0mDsxQ5N1qAaHvDcWky', 'admin'),
  (2, 'Mekanik Handal', 'mechanic@bengkel.com', '081234567891', '$2y$10$73uaJCgcaFtlfx6L3XFyVe4ITa87H.y2R6Mo7TAxkLaXGZQ.p2xtu', 'mechanic'),
  (3, 'Customer Setia', 'customer@bengkel.com', '081234567892', '$2y$10$Nc8qaavewPKtnWSzIJIHgOsjwRwKW5RhdCe.9qXiun6ey8wMfh6PG', 'customer')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `email` = VALUES(`email`),
  `phone` = VALUES(`phone`),
  `password_hash` = VALUES(`password_hash`),
  `role` = VALUES(`role`);