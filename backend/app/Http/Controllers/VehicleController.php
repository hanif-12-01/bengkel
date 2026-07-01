<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = $request->user()
            ->vehicles()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data kendaraan',
            'data' => $vehicles,
        ], 200);
    }

    public function store(StoreVehicleRequest $request)
    {
        $vehicle = $request->user()->vehicles()->create([
            'vehicle_type' => $request->vehicle_type,
            'brand' => trim($request->brand),
            'model' => trim($request->model),
            'year' => $request->year,
            'plate_number' => strtoupper(trim($request->plate_number)),
            'color' => $request->filled('color') ? trim($request->color) : null,
            'current_mileage' => $request->current_mileage,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil disimpan',
            'data' => $vehicle,
        ], 201);
    }

    public function update(StoreVehicleRequest $request, $id)
    {
        $vehicle = $request->user()->vehicles()->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan',
            ], 404);
        }

        $vehicle->update([
            'vehicle_type' => $request->vehicle_type,
            'brand' => trim($request->brand),
            'model' => trim($request->model),
            'year' => $request->year,
            'plate_number' => strtoupper(trim($request->plate_number)),
            'color' => $request->filled('color') ? trim($request->color) : null,
            'current_mileage' => $request->current_mileage,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil diperbarui',
            'data' => $vehicle->fresh(),
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->find($id);

        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak ditemukan',
            ], 404);
        }

        if ($vehicle->bookings()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan tidak bisa dihapus karena sudah memiliki booking terkait.',
            ], 422);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil dihapus',
            'data' => null,
        ], 200);
    }
}
