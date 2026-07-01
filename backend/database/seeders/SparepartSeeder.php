<?php

namespace Database\Seeders;

use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class SparepartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Both Car and Motorcycle Spareparts
        Sparepart::create([
            'name' => 'Oli Mesin Castrol 1L',
            'code' => 'SP-OLI-CASTROL-1L',
            'price' => 75000.00,
            'stock' => 50,
            'vehicle_type' => 'both',
        ]);

        Sparepart::create([
            'name' => 'Busi NGK Standar',
            'code' => 'SP-BUSI-NGK-STD',
            'price' => 25000.00,
            'stock' => 100,
            'vehicle_type' => 'both',
        ]);

        // Car Only Spareparts
        Sparepart::create([
            'name' => 'Filter Oli Mobil Avanza/Xenia',
            'code' => 'SP-FIL-OLI-AVX',
            'price' => 45000.00,
            'stock' => 30,
            'vehicle_type' => 'car',
        ]);

        Sparepart::create([
            'name' => 'Kampas Rem Depan Avanza',
            'code' => 'SP-REM-DEP-AVZ',
            'price' => 180000.00,
            'stock' => 15,
            'vehicle_type' => 'car',
        ]);

        Sparepart::create([
            'name' => 'Filter AC Mobil Denso',
            'code' => 'SP-FAC-DENSO',
            'price' => 120000.00,
            'stock' => 20,
            'vehicle_type' => 'car',
        ]);

        // Motorcycle Only Spareparts
        Sparepart::create([
            'name' => 'Roller Set Honda Beat',
            'code' => 'SP-ROL-HND-BT',
            'price' => 60000.00,
            'stock' => 20,
            'vehicle_type' => 'motorcycle',
        ]);

        Sparepart::create([
            'name' => 'V-Belt Honda Beat',
            'code' => 'SP-VBLT-HND-BT',
            'price' => 95000.00,
            'stock' => 25,
            'vehicle_type' => 'motorcycle',
        ]);

        Sparepart::create([
            'name' => 'Rantai & Gear Set Supra X 125',
            'code' => 'SP-RNT-SUPRA-125',
            'price' => 150000.00,
            'stock' => 12,
            'vehicle_type' => 'motorcycle',
        ]);
    }
}
