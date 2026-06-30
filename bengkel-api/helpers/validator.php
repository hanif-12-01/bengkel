<?php

/**
 * Membaca JSON Input dengan aman (Defensive Programming)
 * - Membatasi Content-Type hanya application/json untuk request yang mengirimkan body (POST/PUT/PATCH).
 * - Membatasi ukuran body (maksimal 1 MB).
 * - Menolak JSON invalid.
 */
function getJsonInput(): array
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    // Validasi Content-Type untuk method yang memiliki body
    if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
        if (strpos(strtolower($contentType), 'application/json') === false) {
            errorResponse('Content-Type harus berupa application/json', [
                'headers' => 'Header Content-Type: application/json wajib dikirimkan.'
            ], 415); // Unsupported Media Type
        }
    }

    // Ambil input stream dan batasi ukurannya
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    $maxSize = 1024 * 1024; // 1 MB

    if ($contentLength > $maxSize) {
        errorResponse('Ukuran request body terlalu besar (maksimal 1 MB)', [
            'body' => 'Request body melebihi batas 1 MB.'
        ], 413); // Payload Too Large
    }

    $rawInput = file_get_contents('php://input');

    // Cek ukuran nyata jika Content-Length dipalsukan atau tidak dikirim
    if (strlen($rawInput) > $maxSize) {
        errorResponse('Ukuran request body terlalu besar (maksimal 1 MB)', [
            'body' => 'Request body melebihi batas 1 MB.'
        ], 413);
    }

    if (empty($rawInput) && in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
        errorResponse('Request body tidak boleh kosong', [
            'body' => 'Mohon sertakan data JSON yang valid.'
        ], 400);
    }

    if (empty($rawInput)) {
        return [];
    }

    $data = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        errorResponse('Format JSON tidak valid', [
            'body' => 'Gagal melakukan parsing JSON: ' . json_last_error_msg()
        ], 400);
    }

    if (!is_array($data)) {
        errorResponse('Format JSON tidak valid', [
            'body' => 'Struktur JSON terluar harus berupa objek atau array.'
        ], 400);
    }

    return $data;
}

/**
 * Menormalkan string: menghapus tag HTML/JS (cegah XSS) dan memotong panjang jika melebihi batas.
 */
function normalizeString(?string $value, int $maxLength = 255): string
{
    if ($value === null) {
        return '';
    }
    // Hapus whitespace di awal/akhir
    $cleaned = trim($value);
    // Hapus tag HTML/JS mentah untuk mencegah XSS tersimpan
    $cleaned = strip_tags($cleaned);
    // Batasi panjang string
    if (mb_strlen($cleaned) > $maxLength) {
        $cleaned = mb_substr($cleaned, 0, $maxLength);
    }
    return $cleaned;
}

/**
 * Validasi field wajib diisi dan memiliki panjang maksimal.
 */
function validateRequired(array $data, array $requiredFields, int $maxLength = 255): array
{
    $errors = [];
    foreach ($requiredFields as $field) {
        if (!array_key_exists($field, $data) || $data[$field] === null || trim((string)$data[$field]) === '') {
            $errors[$field] = 'Field ini wajib diisi.';
        } else {
            $val = trim((string)$data[$field]);
            if (mb_strlen($val) > $maxLength) {
                $errors[$field] = "Panjang maksimal field ini adalah {$maxLength} karakter.";
            }
        }
    }
    return $errors;
}

/**
 * Validasi email
 */
function validateEmail(?string $email): bool
{
    if ($email === null || trim($email) === '') {
        return false;
    }
    $email = trim($email);
    // Batasi panjang email wajar
    if (strlen($email) > 100) {
        return false;
    }
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validasi nomor telepon Indonesia (cth: 0812..., +628..., 628...)
 */
function validatePhoneIndonesia(?string $phone): bool
{
    if ($phone === null || trim($phone) === '') {
        return false;
    }
    $phone = trim($phone);
    // Pola regex nomor telepon Indonesia wajar
    return preg_match('/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/', $phone) === 1;
}

/**
 * Validasi kekuatan password: minimal 8 karakter, mengandung huruf dan angka
 */
function validatePassword(?string $password): bool
{
    if ($password === null || strlen($password) < 8) {
        return false;
    }
    // Harus mengandung minimal satu huruf dan satu angka
    return preg_match('/[A-Za-z]/', $password) && preg_match('/[0-9]/', $password);
}

/**
 * Validasi OTP: persis 6 digit angka
 */
function validateOtp(?string $otp): bool
{
    if ($otp === null) {
        return false;
    }
    return preg_match('/^[0-9]{6}$/', trim($otp)) === 1;
}

/**
 * Validasi tanggal tidak boleh di masa lampau (timezone Asia/Jakarta)
 */
function validateDateNotPast(?string $date): bool
{
    if ($date === null || !validateDateFormat($date)) {
        return false;
    }
    
    $today = new DateTime('now', new DateTimeZone('Asia/Jakarta'));
    $todayStr = $today->format('Y-m-d');
    
    return $date >= $todayStr;
}

/**
 * Validasi jam operasional (08:00 sampai 17:00)
 */
function validateOperationalTime(?string $time): bool
{
    if ($time === null || !validateTimeFormat($time)) {
        return false;
    }

    $timeVal = substr(normalizeTime($time), 0, 5); // Ambil "HH:MM"
    
    return $timeVal >= '08:00' && $timeVal <= '17:00';
}

/**
 * Validasi plat nomor kendaraan Indonesia wajar (misal: B 1234 ABC, DK 9999 X, dll)
 */
function validatePlateNumber(?string $plate): bool
{
    if ($plate === null) {
        return false;
    }
    $plate = strtoupper(trim($plate));
    // Pola plat nomor Indonesia: 1-2 huruf kode wilayah, 1-4 angka nomor polisi, 1-3 huruf seri
    return preg_match('/^[A-Z]{1,2}\s*[0-9]{1,4}\s*[A-Z]{1,3}$/', $plate) === 1;
}

/**
 * Validasi tahun pembuatan kendaraan: 1900 s/d (Tahun Sekarang + 1)
 */
function validateVehicleYear(?int $year): bool
{
    if ($year === null) {
        return false;
    }
    $currentYear = (int)date('Y');
    return $year >= 1900 && $year <= ($currentYear + 1);
}

/**
 * Validasi enum
 */
function validateEnum(?string $value, array $allowedValues, string $fieldName): ?string
{
    if ($value === null || !in_array($value, $allowedValues, true)) {
        $allowedList = implode(', ', $allowedValues);
        return "Field {$fieldName} harus bernilai salah satu dari: {$allowedList}.";
    }
    return null;
}

/**
 * Konversi nilai ke safe integer dalam range tertentu
 */
function toSafeInteger($value, string $fieldName, int $min = 0, int $max = PHP_INT_MAX): int
{
    if (!is_numeric($value)) {
        errorResponse("Field {$fieldName} harus berupa angka.", [
            $fieldName => "Nilai wajib berupa integer numerik."
        ], 400);
    }
    
    $intValue = (int)$value;
    if ($intValue < $min || $intValue > $max) {
        errorResponse("Nilai {$fieldName} di luar batas yang diperbolehkan.", [
            $fieldName => "Nilai harus berada di rentang {$min} s/d {$max}."
        ], 400);
    }
    
    return $intValue;
}

/**
 * Mencegah mass assignment dengan hanya mengambil field yang diperbolehkan
 */
function pickAllowedFields(array $body, array $allowedFields): array
{
    $filtered = [];
    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $body)) {
            $filtered[$field] = $body[$field];
        }
    }
    return $filtered;
}

function validateVehicleType(string $vehicleType): bool
{
    return in_array(strtolower($vehicleType), ['mobil', 'motor', 'car', 'motorcycle'], true);
}

function normalizeVehicleType(string $vehicleType): string
{
    $lower = strtolower($vehicleType);
    return match ($lower) {
        'car' => 'mobil',
        'motorcycle' => 'motor',
        default => $lower,
    };
}

function validateBookingStatus(string $status): bool
{
    return in_array($status, [
        'Menunggu Konfirmasi',
        'Dikonfirmasi',
        'Kendaraan Diterima',
        'Sedang Dikerjakan',
        'Selesai',
        'Dibatalkan',
    ], true);
}

function validateDateFormat(string $date): bool
{
    $parsedDate = DateTime::createFromFormat('Y-m-d', $date);
    return $parsedDate && $parsedDate->format('Y-m-d') === $date;
}

function validateTimeFormat(string $time): bool
{
    $normalizedTime = strlen($time) === 5 ? "{$time}:00" : $time;
    $parsedTime = DateTime::createFromFormat('H:i:s', $normalizedTime);

    return $parsedTime && $parsedTime->format('H:i:s') === $normalizedTime;
}

function normalizeTime(string $time): string
{
    return strlen($time) === 5 ? "{$time}:00" : $time;
}