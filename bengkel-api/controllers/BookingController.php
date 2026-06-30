<?php

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validator.php';
require_once __DIR__ . '/../helpers/auth.php';

class BookingController
{
    public function __construct(
        private PDO $db,
        private Booking $bookingModel,
        private Vehicle $vehicleModel,
        private Workshop $workshopModel,
        private Service $serviceModel
    ) {
    }

    public function index(): void
    {
        $user = requireAuth($this->db);

        // Jika customer, hanya tampilkan booking miliknya sendiri
        if ($user['role'] === 'customer') {
            $data = $this->bookingModel->getAll((int)$user['id']);
            successResponse('Berhasil mengambil data booking customer', $data);
        } else {
            // Admin atau mechanic bisa melihat semua booking
            $data = $this->bookingModel->getAll();
            successResponse('Berhasil mengambil semua data booking', $data);
        }
    }

    public function show(string $id): void
    {
        $user = requireAuth($this->db);
        
        // Defensive programming: sanitize dan validasi parameter ID
        $cleanId = preg_replace('/[^a-zA-Z0-9\-]/', '', $id);
        if (empty($cleanId)) {
            errorResponse('Format ID Booking tidak valid.', [], 400);
        }

        $booking = $this->bookingModel->findById($cleanId);

        if (!$booking) {
            notFoundResponse('Booking tidak ditemukan');
        }

        // Jika customer, pastikan ini adalah booking miliknya sendiri (Access Control Check)
        if ($user['role'] === 'customer' && (int)$booking['user_id'] !== (int)$user['id']) {
            errorResponse('Anda tidak memiliki akses ke booking ini.', [], 403);
        }

        successResponse('Berhasil mengambil detail booking', $booking);
    }

    public function store(): void
    {
        $user = requireAuth($this->db);
        $data = getJsonInput();

        $errors = validateRequired($data, [
            'customer_name',
            'phone',
            'vehicle_id',
            'workshop_id',
            'booking_date',
            'booking_time',
            'service_ids',
        ]);

        if (!empty($errors)) {
            errorResponse('Validasi booking gagal', $errors, 422);
        }

        // Sanitasi dan normalisasi input (Defensive programming)
        $customerName = normalizeString($data['customer_name'], 100);
        $phone = normalizeString($data['phone'], 20);
        $email = isset($data['email']) && trim((string)$data['email']) !== '' ? normalizeString($data['email'], 100) : null;
        $complaintNote = isset($data['complaint_note']) ? normalizeString($data['complaint_note'], 1000) : null;

        if (!validatePhoneIndonesia($phone)) {
            $errors['phone'] = 'Format nomor telepon tidak valid. Gunakan format Indonesia seperti 0812xxxxxxxx atau +628xxxxxxxx.';
        }

        if ($email !== null && !validateEmail($email)) {
            $errors['email'] = 'Format email tidak valid.';
        }

        if (!validateDateFormat((string)$data['booking_date'])) {
            $errors['booking_date'] = 'Format tanggal harus YYYY-MM-DD.';
        } else {
            // Cek apakah tanggal booking di masa lampau
            if (!validateDateNotPast((string)$data['booking_date'])) {
                $errors['booking_date'] = 'Tanggal booking tidak boleh di masa lampau.';
            }
        }

        if (!validateTimeFormat((string)$data['booking_time'])) {
            $errors['booking_time'] = 'Format waktu harus HH:MM atau HH:MM:SS.';
        } else {
            // Cek apakah di jam operasional 08:00 - 17:00
            if (!validateOperationalTime((string)$data['booking_time'])) {
                $errors['booking_time'] = 'Waktu booking harus berada dalam jam operasional bengkel (08:00 - 17:00).';
            }
        }

        $vehicleId = toSafeInteger($data['vehicle_id'], 'vehicle_id', 1);
        $workshopId = toSafeInteger($data['workshop_id'], 'workshop_id', 1);

        // Validasi kepemilikan kendaraan (Access Control / IDOR Check)
        $vehicle = $this->vehicleModel->findById($vehicleId);
        if (!$vehicle) {
            $errors['vehicle_id'] = 'Data kendaraan tidak ditemukan.';
        } else {
            // Jika role user adalah customer, kendaraan harus miliknya sendiri
            if ($user['role'] === 'customer' && (int)$vehicle['user_id'] !== (int)$user['id']) {
                $errors['vehicle_id'] = 'Anda tidak memiliki akses ke kendaraan ini.';
            }
        }

        // Validasi keberadaan bengkel
        if (!$this->workshopModel->exists($workshopId)) {
            $errors['workshop_id'] = 'Data bengkel tidak ditemukan atau tidak aktif.';
        }

        // Validasi layanan
        if (!is_array($data['service_ids']) || count($data['service_ids']) === 0) {
            $errors['service_ids'] = 'Pilih minimal satu layanan.';
            $services = [];
        } else {
            // Pastikan semua service_id bertipe integer dan aman
            try {
                $safeServiceIds = array_map(function($id) {
                    return toSafeInteger($id, 'service_ids', 1);
                }, $data['service_ids']);
                
                $services = $this->serviceModel->findManyByIds($safeServiceIds);

                if (count($services) !== count(array_unique($safeServiceIds))) {
                    $errors['service_ids'] = 'Satu atau beberapa layanan tidak valid.';
                }

                // Validasi kecocokan tipe kendaraan layanan dengan tipe kendaraan yang di-booking
                if ($vehicle && empty($errors['service_ids'])) {
                    $vehicleTypeNormalized = normalizeVehicleType($vehicle['vehicle_type']);
                    foreach ($services as $service) {
                        $serviceVehicleTypeNormalized = normalizeVehicleType($service['vehicle_type']);
                        if ($serviceVehicleTypeNormalized !== $vehicleTypeNormalized) {
                            $errors['service_ids'] = "Layanan '{$service['name']}' hanya berlaku untuk tipe kendaraan {$service['vehicle_type']}. Kendaraan Anda bertipe {$vehicle['vehicle_type']}.";
                            break;
                        }
                    }
                }
            } catch (Exception $e) {
                $errors['service_ids'] = 'Format data layanan tidak valid.';
                $services = [];
            }
        }

        if (count($errors) > 0) {
            errorResponse('Validasi booking gagal', $errors, 422);
        }

        // Susun payload yang bersih dan aman
        $safePayload = [
            'customer_name' => $customerName,
            'phone' => $phone,
            'email' => $email,
            'vehicle_id' => $vehicleId,
            'workshop_id' => $workshopId,
            'booking_date' => $data['booking_date'],
            'booking_time' => normalizeTime((string)$data['booking_time']),
            'complaint_note' => $complaintNote,
            'service_ids' => $data['service_ids']
        ];

        try {
            $booking = $this->bookingModel->create($safePayload, $services, (int)$user['id']);
            successResponse('Booking berhasil dibuat', $booking, 201);
        } catch (Exception $e) {
            error_log("Error creating booking: " . $e->getMessage());
            errorResponse('Gagal membuat booking.', [], 500);
        }
    }

    public function updateStatus(string $id): void
    {
        // Hanya admin dan mekanik yang bisa mengupdate status
        $user = requireAdminOrMechanic($this->db);
        
        $cleanId = preg_replace('/[^a-zA-Z0-9\-]/', '', $id);
        if (empty($cleanId)) {
            errorResponse('Format ID Booking tidak valid.', [], 400);
        }

        $data = getJsonInput();
        $errors = validateRequired($data, ['status']);

        if (!empty($errors)) {
            errorResponse('Validasi status gagal', $errors, 422);
        }

        $status = normalizeString($data['status'], 50);

        if (!validateBookingStatus($status)) {
            $errors['status'] = 'Status booking tidak valid.';
        }

        if (count($errors) > 0) {
            errorResponse('Validasi status gagal', $errors, 422);
        }

        if (!$this->bookingModel->findById($cleanId)) {
            notFoundResponse('Booking tidak ditemukan');
        }

        try {
            $booking = $this->bookingModel->updateStatus($cleanId, $status);
            successResponse('Status booking berhasil diperbarui', $booking);
        } catch (Exception $e) {
            error_log("Error updating booking status: " . $e->getMessage());
            errorResponse('Gagal memperbarui status booking.', [], 500);
        }
    }
}