<?php

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validator.php';
require_once __DIR__ . '/../helpers/auth.php';

class VehicleController
{
    public function __construct(
        private PDO $db,
        private Vehicle $vehicleModel
    ) {
    }

    public function store(): void
    {
        $user = requireAuth($this->db);
        $data = getJsonInput();

        $errors = validateRequired($data, [
            'vehicle_type',
            'brand',
            'model',
            'year',
            'plate_number',
            'current_mileage',
        ]);

        if (!empty($errors)) {
            errorResponse('Validasi kendaraan gagal', $errors, 422);
        }

        // Sanitasi dan Normalisasi (Defensive programming)
        $vehicleType = normalizeVehicleType((string)$data['vehicle_type']);
        $brand = normalizeString($data['brand'], 100);
        $model = normalizeString($data['model'], 100);
        $plateNumber = strtoupper(normalizeString($data['plate_number'], 20));

        if (!validateVehicleType($vehicleType)) {
            $errors['vehicle_type'] = 'Jenis kendaraan harus mobil atau motor.';
        }

        if (!validateVehicleYear((int)$data['year'])) {
            $errors['year'] = 'Tahun kendaraan tidak valid (tidak boleh di masa depan atau di bawah 1900).';
        }

        if (!validatePlateNumber($plateNumber)) {
            $errors['plate_number'] = 'Format nomor polisi tidak valid (misal: B 1234 CD atau B-1234-CD atau B1234CD).';
        }

        try {
            $currentMileage = toSafeInteger($data['current_mileage'], 'current_mileage', 0);
            if ($currentMileage < 0) {
                $errors['current_mileage'] = 'Kilometer kendaraan tidak boleh negatif.';
            }
        } catch (Exception $e) {
            $errors['current_mileage'] = 'Format kilometer kendaraan tidak valid.';
        }

        if (count($errors) > 0) {
            errorResponse('Validasi kendaraan gagal', $errors, 422);
        }

        // Susun payload yang bersih dan aman
        $safePayload = [
            'user_id' => (int)$user['id'],
            'vehicle_type' => $vehicleType,
            'brand' => $brand,
            'model' => $model,
            'year' => (int)$data['year'],
            'plate_number' => $plateNumber,
            'current_mileage' => $currentMileage
        ];

        try {
            $vehicleId = $this->vehicleModel->create($safePayload);
            $vehicle = $this->vehicleModel->findById($vehicleId);

            successResponse('Kendaraan berhasil disimpan', $vehicle, 201);
        } catch (Exception $e) {
            error_log("Error creating vehicle: " . $e->getMessage());
            errorResponse('Gagal menyimpan data kendaraan.', [], 500);
        }
    }
}