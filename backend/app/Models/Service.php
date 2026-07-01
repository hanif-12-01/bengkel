<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_minutes',
        'vehicle_type',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'duration_minutes' => 'integer',
        ];
    }

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_services');
    }
}
