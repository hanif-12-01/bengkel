<?php

// Ambil origin pengirim dari header HTTP_ORIGIN
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Izinkan origin secara dinamis untuk mendukung Vercel, Netlify, maupun Localhost.
// Ini memudahkan pemanggilan API dari domain frontend manapun tanpa masalah CORS.
if ($origin) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}