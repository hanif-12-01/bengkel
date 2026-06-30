<?php

class VehicleController
{
    public function __construct(private Vehicle $vehicleModel)
    {
    }

    public function store(): void
    {
        $data = getJsonInput();

        $errors = validateRequired($data, [
            'vehicle_type',
            'brand',
            'model',
            'year',
            'plate_number',
            'current_mileage',
        ]);

        if (isset($data['vehicle_type']) && !validateVehicleType((string) $data['vehicle_type'])) {
            $errors['vehicle_type'] = 'Jenis kendaraan harus mobil atau motor.';
        }

        if (isset($data['year']) && ((int) $data['year'] < 1950 || (int) $data['year'] > ((int) date('Y') + 1))) {
            $errors['year'] = 'Tahun kendaraan tidak valid.';
        }

        if (isset($data['current_mileage']) && (int) $data['current_mileage'] < 0) {
            $errors['current_mileage'] = 'Kilometer kendaraan tidak boleh negatif.';
        }

        if (count($errors) > 0) {
            errorResponse('Validasi kendaraan gagal', $errors, 422);
        }

        $vehicleId = $this->vehicleModel->create($data);
        $vehicle = $this->vehicleModel->findById($vehicleId);

        successResponse('Kendaraan berhasil disimpan', $vehicle, 201);
    }
}