<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = $request->user()->vehicles;

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data kendaraan',
            'data' => $vehicles,
        ], 200);
    }

    public function store(StoreVehicleRequest $request)
    {
        $vehicleType = $request->vehicle_type;
        if ($vehicleType === 'car') {
            $vehicleType = 'mobil';
        } elseif ($vehicleType === 'motorcycle') {
            $vehicleType = 'motor';
        }

        $vehicle = $request->user()->vehicles()->create([
            'vehicle_type' => $vehicleType,
            'brand' => $request->brand,
            'model' => $request->model,
            'year' => $request->year,
            'plate_number' => strtoupper($request->plate_number),
            'current_mileage' => $request->current_mileage,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil disimpan',
            'data' => $vehicle,
        ], 201);
    }
}
