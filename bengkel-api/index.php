<?php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/validator.php';
require_once __DIR__ . '/helpers/auth.php';

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