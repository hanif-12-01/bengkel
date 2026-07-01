<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CustomerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Bengkel',
            'email' => 'admin@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
        ]);

        // Mechanics
        User::create([
            'name' => 'Budi Mechanic',
            'email' => 'budi@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'mechanic',
            'phone' => '081234567891',
        ]);

        User::create([
            'name' => 'Joko Mechanic',
            'email' => 'joko@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'mechanic',
            'phone' => '081234567892',
        ]);

        // Customers
        $customer1 = User::create([
            'name' => 'Andi Customer',
            'email' => 'andi@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '081234567893',
        ]);

        CustomerProfile::create([
            'user_id' => $customer1->id,
            'address' => 'Jl. Merdeka No. 10, Jakarta',
        ]);

        $customer2 = User::create([
            'name' => 'Siti Customer',
            'email' => 'siti@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '081234567894',
        ]);

        CustomerProfile::create([
            'user_id' => $customer2->id,
            'address' => 'Jl. Mawar No. 5, Bandung',
        ]);
    }
}
