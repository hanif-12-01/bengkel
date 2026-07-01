<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'workshop_id',
        'mechanic_id',
        'booking_time',
        'status',
        'notes',
        'cancel_reason',
        'total_price',
    ];

    protected function casts(): array
    {
        return [
            'booking_time' => 'datetime',
            'total_price' => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'booking_services');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function inspection()
    {
        return $this->hasOne(Inspection::class);
    }
}
