<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Vehicle;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            $bookings = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
            $message = 'Berhasil mengambil data booking customer';
        } elseif ($user->role === 'mechanic') {
            $bookings = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])
                ->where('mechanic_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
            $message = 'Berhasil mengambil data booking mekanik';
        } else {
            $bookings = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])
                ->orderBy('created_at', 'desc')
                ->get();
            $message = 'Berhasil mengambil semua data booking';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $bookings,
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan',
            ], 404);
        }

        if ($user->role === 'customer' && $booking->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke booking ini.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil detail booking',
            'data' => $booking,
        ], 200);
    }

    public function store(StoreBookingRequest $request)
    {
        $user = $request->user();
        $vehicle = Vehicle::find($request->vehicle_id);

        if ($vehicle->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi booking gagal',
                'errors' => ['vehicle_id' => ['Anda tidak memiliki akses ke kendaraan ini.']],
            ], 422);
        }

        $services = Service::whereIn('id', $request->service_ids)->get();

        // Validate vehicle type compatibility
        $vehicleTypeNormalized = $vehicle->vehicle_type === 'mobil' ? 'mobil' : 'motor';
        foreach ($services as $service) {
            $serviceTypeNormalized = $service->vehicle_type === 'mobil' ? 'mobil' : 'motor';
            if ($serviceTypeNormalized !== $vehicleTypeNormalized) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi booking gagal',
                    'errors' => ['service_ids' => ["Layanan '{$service->name}' hanya berlaku untuk tipe kendaraan {$service->vehicle_type}."]],
                ], 422);
            }
        }

        // Check slots capacity
        $bookingDateTime = Carbon::createFromFormat('Y-m-d H:i', $request->booking_date . ' ' . $request->booking_time);
        $activeCount = Booking::where('workshop_id', $request->workshop_id)
            ->where('booking_time', $bookingDateTime)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->count();

        if ($activeCount >= 2) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi booking gagal',
                'errors' => ['booking_time' => ['Slot kapasitas bengkel pada jam tersebut sudah penuh. Silakan pilih jam atau tanggal lain.']],
            ], 422);
        }

        $totalPrice = $services->sum('price');

        $booking = DB::transaction(function () use ($user, $request, $bookingDateTime, $totalPrice, $services) {
            $booking = Booking::create([
                'user_id' => $user->id,
                'vehicle_id' => $request->vehicle_id,
                'workshop_id' => $request->workshop_id,
                'booking_time' => $bookingDateTime,
                'status' => 'pending',
                'notes' => $request->complaint_note,
                'total_price' => $totalPrice,
            ]);

            $booking->services()->attach($services->pluck('id')->toArray());
            return $booking;
        });

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibuat',
            'data' => Booking::with(['vehicle', 'workshop', 'mechanic', 'services'])->find($booking->id),
        ], 201);
    }

    public function getBookingSlots(Request $request)
    {
        $workshopId = $request->query('workshop_id');
        $date = $request->query('date');

        if (!$workshopId || !$date) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter workshop_id dan date wajib diisi.',
            ], 400);
        }

        $workshop = Workshop::find($workshopId);
        if (!$workshop) {
            return response()->json([
                'success' => false,
                'message' => 'Bengkel tidak ditemukan.',
            ], 404);
        }

        $timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
        $maxCapacity = 2;
        $resultSlots = [];

        foreach ($timeSlots as $slot) {
            $bookingDateTime = Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $slot);
            $activeCount = Booking::where('workshop_id', $workshopId)
                ->where('booking_time', $bookingDateTime)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->count();

            $available = max(0, $maxCapacity - $activeCount);

            $resultSlots[] = [
                'time' => $slot,
                'capacity' => $maxCapacity,
                'booked' => $activeCount,
                'available' => $available,
                'is_available' => $available > 0,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data slot booking',
            'data' => $resultSlots,
        ], 200);
    }
}
