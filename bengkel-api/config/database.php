<?php

// Dapatkan variabel koneksi dari environment variables (untuk Railway) atau fallback ke default local
$host = getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('MYSQLDATABASE') ?: getenv('DB_DATABASE') ?: 'bengkel_app';
$user = getenv('MYSQLUSER') ?: getenv('DB_USERNAME') ?: 'root';
$pass = getenv('MYSQLPASSWORD') ?: getenv('DB_PASSWORD') ?: '';
$port = getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: '3306';
$charset = 'utf8mb4';

$dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    return new PDO($dsn, $user, $pass, $options);
} catch (PDOException $exception) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal. Pastikan MySQL XAMPP aktif dan database bengkel_app sudah diimport.',
        'errors' => [
            'database' => $exception->getMessage(),
        ],
    ]);

    exit;
}