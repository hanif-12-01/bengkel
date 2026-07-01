<?php

use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\WorkshopController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/workshops', [WorkshopController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Booking slots helper
    Route::get('/booking-slots', [BookingController::class, 'getBookingSlots']);

    // Customer routes
    Route::prefix('customer')->group(function () {
        Route::get('/vehicles', [VehicleController::class, 'index']);
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::get('/bookings/{id}', [BookingController::class, 'show']);
        Route::post('/bookings', [BookingController::class, 'store']);
    });

    // Admin & Mechanic routes
    Route::prefix('admin')->group(function () {
        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
        Route::patch('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
        Route::patch('/bookings/{id}/assign-mechanic', [AdminBookingController::class, 'assignMechanic']);
        Route::get('/mechanics', [AdminBookingController::class, 'mechanics']);
    });
});
