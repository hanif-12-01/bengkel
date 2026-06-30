<?php

class ServiceController
{
    public function __construct(private Service $serviceModel)
    {
    }

    public function index(): void
    {
        $vehicleType = $_GET['vehicle_type'] ?? null;

        if ($vehicleType !== null && !validateVehicleType((string) $vehicleType)) {
            errorResponse('Jenis kendaraan tidak valid', [
                'vehicle_type' => 'Gunakan mobil atau motor.',
            ], 422);
        }

        successResponse('Berhasil mengambil data layanan', $this->serviceModel->getAll($vehicleType));
    }
}