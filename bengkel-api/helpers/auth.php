<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/response.php';

function getBearerToken(): ?string
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];

    $authorization = $headers['Authorization']
        ?? $headers['authorization']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';

    if (preg_match('/Bearer\s+(.+)/i', $authorization, $matches)) {
        return trim($matches[1]);
    }

    return null;
}

function currentUser(PDO $db): ?array
{
    $token = getBearerToken();

    if (!$token) {
        return null;
    }

    $userModel = new User($db);
    $userModel->deleteExpiredTokens();

    return $userModel->findByToken($token);
}

function requireAuth(PDO $db): array
{
    $user = currentUser($db);

    if (!$user) {
        errorResponse(
            'Silakan login terlebih dahulu.',
            ['auth' => 'Token tidak valid atau sudah kedaluwarsa.'],
            401
        );
    }

    return $user;
}

function requireRole(PDO $db, array $allowedRoles): array
{
    $user = requireAuth($db);

    if (!in_array($user['role'], $allowedRoles, true)) {
        errorResponse(
            'Anda tidak memiliki akses ke fitur ini.',
            ['role' => 'Role tidak diizinkan.'],
            403
        );
    }

    return $user;
}

function requireAdminOrMechanic(PDO $db): array
{
    return requireRole($db, ['admin', 'mechanic']);
}