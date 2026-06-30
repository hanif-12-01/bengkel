<?php

function getJsonInput(): array
{
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput ?: '{}', true);

    if (!is_array($data)) {
        errorResponse('Format JSON tidak valid', [
            'body' => 'Request body harus berupa JSON yang valid.',
        ], 400);
    }

    return $data;
}

function validateRequired(array $data, array $requiredFields): array
{
    $errors = [];

    foreach ($requiredFields as $field) {
        if (!array_key_exists($field, $data) || $data[$field] === null || trim((string) $data[$field]) === '') {
            $errors[$field] = 'Field ini wajib diisi.';
        }
    }

    return $errors;
}

function validateEmail(?string $email): bool
{
    if ($email === null || trim($email) === '') {
        return true;
    }

    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateVehicleType(string $vehicleType): bool
{
    return in_array($vehicleType, ['mobil', 'motor', 'car', 'motorcycle'], true);
}

function normalizeVehicleType(string $vehicleType): string
{
    return match ($vehicleType) {
        'car' => 'mobil',
        'motorcycle' => 'motor',
        default => $vehicleType,
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