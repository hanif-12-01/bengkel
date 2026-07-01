<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Both Car and Motorcycle Services
        Service::create([
            'name' => 'Ganti Oli Mesin',
            'description' => 'Penggantian oli mesin standar dengan oli berkualitas tinggi sesuai tipe kendaraan.',
            'price' => 150000.00,
            'duration_minutes' => 30,
            'vehicle_type' => 'both',
        ]);

        Service::create([
            'name' => 'Tune Up Mesin',
            'description' => 'Pemeriksaan dan penyetelan ulang performa mesin agar kembali optimal.',
            'price' => 250000.00,
            'duration_minutes' => 60,
            'vehicle_type' => 'both',
        ]);

        Service::create([
            'name' => 'Service Rem Depan Belakang',
            'description' => 'Pembersihan kampas rem, penyetelan jarak pengereman, dan penggantian minyak rem jika diperlukan.',
            'price' => 120000.00,
            'duration_minutes' => 45,
            'vehicle_type' => 'both',
        ]);

        // Car Only Services
        Service::create([
            'name' => 'Spooring & Balancing',
            'description' => 'Penyelarasan sudut roda (spooring) dan penyeimbangan putaran roda (balancing) untuk mobil.',
            'price' => 350000.00,
            'duration_minutes' => 90,
            'vehicle_type' => 'car',
        ]);

        Service::create([
            'name' => 'Service AC Mobil',
            'description' => 'Pembersihan filter kabin, pengisian freon, dan cek kebocoran AC mobil.',
            'price' => 450000.00,
            'duration_minutes' => 120,
            'vehicle_type' => 'car',
        ]);

        // Motorcycle Only Services
        Service::create([
            'name' => 'Service CVT (Motor Matic)',
            'description' => 'Pembersihan dan pelumasan komponen CVT (Continuously Variable Transmission) untuk motor matic.',
            'price' => 80000.00,
            'duration_minutes' => 45,
            'vehicle_type' => 'motorcycle',
        ]);

        Service::create([
            'name' => 'Ganti Rantai dan Gear',
            'description' => 'Penggantian satu set rantai dan gear depan-belakang untuk motor manual.',
            'price' => 180000.00,
            'duration_minutes' => 40,
            'vehicle_type' => 'motorcycle',
        ]);
    }
}
