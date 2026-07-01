<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $vehicleType = $request->query('vehicle_type');

        if ($vehicleType !== null) {
            $vehicleType = strtolower(trim($vehicleType));
            if (!in_array($vehicleType, ['mobil', 'motor'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jenis kendaraan tidak valid',
                    'errors' => [
                        'vehicle_type' => 'Gunakan mobil atau motor.',
                    ]
                ], 422);
            }
        }

        $query = Service::query();
        if ($vehicleType !== null) {
            $query->where('vehicle_type', $vehicleType);
        }

        $services = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data layanan',
            'data' => $services,
        ], 200);
    }
}
