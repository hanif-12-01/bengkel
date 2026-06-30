<?php

class ServiceController
{
    public function __construct(private Service $serviceModel)
    {
    }

    public function index(): void
    {
        // Ambil query param dan sanitasi
        $rawVehicleType = $_GET['vehicle_type'] ?? null;
        $vehicleType = null;

        if ($rawVehicleType !== null) {
            $cleanVehicleType = normalizeString((string)$rawVehicleType, 20);
            
            if (!validateVehicleType($cleanVehicleType)) {
                errorResponse('Jenis kendaraan tidak valid', [
                    'vehicle_type' => 'Gunakan mobil atau motor.',
                ], 422);
            }
            
            $vehicleType = normalizeVehicleType($cleanVehicleType);
        }

        successResponse('Berhasil mengambil data layanan', $this->serviceModel->getAll($vehicleType));
    }
}