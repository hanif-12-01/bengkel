<?php

function sendJsonResponse(bool $success, string $message, mixed $data = null, array $errors = [], int $statusCode = 200): void
{
    http_response_code($statusCode);

    $payload = [
        'success' => $success,
        'message' => $message,
    ];

    if ($success) {
        $payload['data'] = $data ?? new stdClass();
    } else {
        $payload['errors'] = $errors;
    }

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function successResponse(string $message = 'Berhasil', mixed $data = null, int $statusCode = 200): void
{
    sendJsonResponse(true, $message, $data, [], $statusCode);
}

function errorResponse(string $message = 'Terjadi kesalahan', array $errors = [], int $statusCode = 400): void
{
    sendJsonResponse(false, $message, null, $errors, $statusCode);
}

function notFoundResponse(string $message = 'Data tidak ditemukan'): void
{
    errorResponse($message, [], 404);
}

function methodNotAllowedResponse(): void
{
    errorResponse('Method tidak diizinkan', [], 405);
}