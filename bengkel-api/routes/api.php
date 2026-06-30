<?php

/** @var PDO $db */

$serviceModel = new Service($db);
$workshopModel = new Workshop($db);
$vehicleModel = new Vehicle($db);
$bookingModel = new Booking($db);

$authController = new AuthController($db);
$serviceController = new ServiceController($serviceModel);
$workshopController = new WorkshopController($workshopModel);
$vehicleController = new VehicleController($vehicleModel);
$bookingController = new BookingController($db, $bookingModel, $vehicleModel, $workshopModel, $serviceModel);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$basePath = rtrim($scriptName, '/');

if ($basePath !== '' && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}

$path = '/' . trim($path, '/');
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

try {
    if ($method === 'POST' && $path === '/auth/register') {
        $authController->register();
    }

    if ($method === 'POST' && $path === '/auth/login') {
        $authController->login();
    }

    if ($method === 'GET' && $path === '/auth/me') {
        $authController->me();
    }

    if ($method === 'POST' && $path === '/auth/logout') {
        $authController->logout();
    }

    if ($method === 'GET' && $path === '/services') {
        $serviceController->index();
    }

    if ($method === 'GET' && $path === '/workshops') {
        $workshopController->index();
    }

    if ($method === 'POST' && $path === '/vehicles') {
        $vehicleController->store();
    }

    if ($method === 'GET' && $path === '/bookings') {
        $bookingController->index();
    }

    if ($method === 'POST' && $path === '/bookings') {
        $bookingController->store();
    }

    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'bookings') {
        $bookingController->show($segments[1]);
    }

    if ($method === 'PATCH' && count($segments) === 3 && $segments[0] === 'bookings' && $segments[2] === 'status') {
        $bookingController->updateStatus($segments[1]);
    }

    notFoundResponse('Endpoint tidak ditemukan');
} catch (PDOException $exception) {
    errorResponse('Terjadi kesalahan database', [
        'database' => $exception->getMessage(),
    ], 500);
} catch (Throwable $exception) {
    errorResponse('Terjadi kesalahan server', [
        'server' => $exception->getMessage(),
    ], 500);
}