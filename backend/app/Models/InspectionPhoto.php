<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'inspection_id',
        'photo_path',
        'description',
    ];

    public function inspection()
    {
        return $this->belongsTo(Inspection::class);
    }
}
