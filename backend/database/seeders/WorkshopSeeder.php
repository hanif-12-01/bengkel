<?php

namespace Database\Seeders;

use App\Models\Workshop;
use Illuminate\Database\Seeder;

class WorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Workshop::create([
            'name' => 'Bengkel Mobil Sentosa',
            'address' => 'Jl. Jenderal Sudirman No. 45, Jakarta',
            'phone' => '021-5551234',
            'operating_hours' => '08:00 - 17:00',
            'latitude' => -6.21462000,
            'longitude' => 106.84513000,
        ]);

        Workshop::create([
            'name' => 'Ahass Motor Perkasa',
            'address' => 'Jl. Diponegoro No. 88, Bandung',
            'phone' => '022-7775678',
            'operating_hours' => '07:30 - 16:30',
            'latitude' => -6.90344000,
            'longitude' => 107.61861000,
        ]);

        Workshop::create([
            'name' => 'Bengkel Motor & Mobil Cepat',
            'address' => 'Jl. Pemuda No. 12, Surabaya',
            'phone' => '031-4449876',
            'operating_hours' => '08:00 - 19:00',
            'latitude' => -7.26575000,
            'longitude' => 112.74254000,
        ]);
    }
}
