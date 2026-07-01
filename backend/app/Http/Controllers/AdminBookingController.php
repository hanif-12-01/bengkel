<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil semua data booking',
            'data' => $bookings,
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $booking = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil detail booking',
            'data' => $booking,
        ], 200);
    }

    public function updateStatus(UpdateBookingStatusRequest $request, $id)
    {
        $user = $request->user();
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan',
            ], 404);
        }

        if ($user->role === 'mechanic' && $booking->mechanic_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda hanya bisa memperbarui status booking yang ditugaskan kepada Anda.',
            ], 403);
        }

        $booking->status = $request->status;
        if ($request->has('mechanic_id')) {
            $booking->mechanic_id = $request->mechanic_id;
        }
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Status booking berhasil diperbarui',
            'data' => Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])->find($booking->id),
        ], 200);
    }

    public function assignMechanic(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan',
            ], 404);
        }

        $mechanicId = $request->input('mechanic_id');
        if ($mechanicId !== null) {
            $mechanic = User::where('id', $mechanicId)->where('role', 'mechanic')->first();
            if (!$mechanic) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID yang dimasukkan bukan merupakan mekanik yang valid.',
                ], 422);
            }
        }

        $booking->mechanic_id = $mechanicId;
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Mekanik berhasil ditugaskan ke booking ini',
            'data' => Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])->find($booking->id),
        ], 200);
    }

    public function mechanics()
    {
        $mechanics = User::where('role', 'mechanic')
            ->select('id', 'name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data mekanik',
            'data' => $mechanics,
        ], 200);
    }
}
