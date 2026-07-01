<?php

namespace App\Http\Controllers;

use App\Models\Workshop;
use Illuminate\Http\Request;

class WorkshopController extends Controller
{
    public function index()
    {
        $workshops = Workshop::all();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data bengkel',
            'data' => $workshops,
        ], 200);
    }
}
