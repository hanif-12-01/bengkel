<?php

// Set up security headers (Defensive Programming)
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

// Session config securely (HttpOnly, SameSite=Lax)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_only_cookies', 1);
    
    // Aktifkan secure cookie jika menggunakan HTTPS
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? 80) == 443;
    if ($isSecure) {
        ini_set('session.cookie_secure', 1);
    }
    
    session_start();
}

// Matikan penampilan error mentah bawaan PHP ke output langsung
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/validator.php';
require_once __DIR__ . '/helpers/auth.php';

// Custom error handler untuk mencegah error leaking (tidak membocorkan stack trace / internal details)
set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return;
    }
    // Log detail di server log untuk debugging developer
    error_log("Error [$severity]: $message in $file on line $line");
    
    // Tampilkan pesan umum yang aman ke client
    $isDev = (getenv('APP_ENV') ?: 'production') === 'development';
    if ($isDev) {
        errorResponse("Runtime Error: $message in $file on line $line", [], 500);
    } else {
        errorResponse('Terjadi kesalahan internal server.', [], 500);
    }
});

set_exception_handler(function ($exception) {
    // Log detail exception
    error_log("Exception: " . $exception->getMessage() . "\n" . $exception->getTraceAsString());
    
    $isDev = (getenv('APP_ENV') ?: 'production') === 'development';
    if ($isDev) {
        errorResponse("Exception: " . $exception->getMessage(), [
            'trace' => $exception->getTraceAsString()
        ], 500);
    } else {
        errorResponse('Terjadi kesalahan internal server.', [], 500);
    }
});

$db = require __DIR__ . '/config/database.php';

require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Service.php';
require_once __DIR__ . '/models/Workshop.php';
require_once __DIR__ . '/models/Vehicle.php';
require_once __DIR__ . '/models/Booking.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ServiceController.php';
require_once __DIR__ . '/controllers/WorkshopController.php';
require_once __DIR__ . '/controllers/VehicleController.php';
require_once __DIR__ . '/controllers/BookingController.php';

require_once __DIR__ . '/routes/api.php';