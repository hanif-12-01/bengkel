<?php

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
            successResponse('Berhasil mengambil data booking customer', $this->bookingModel->getAll((int) $user['id']));
        } else {
            // Admin atau mechanic bisa melihat semua booking
            successResponse('Berhasil mengambil semua data booking', $this->bookingModel->getAll());
        }
    }

    public function show(string $id): void
    {
        $user = requireAuth($this->db);
        $booking = $this->bookingModel->findById($id);

        if (!$booking) {
            notFoundResponse('Booking tidak ditemukan');
        }

        // Jika customer, pastikan ini adalah booking miliknya sendiri
        if ($user['role'] === 'customer' && (int) $booking['user_id'] !== (int) $user['id']) {
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

        if (!empty($data['email']) && !validateEmail((string) $data['email'])) {
            $errors['email'] = 'Format email tidak valid.';
        }

        if (isset($data['booking_date']) && !validateDateFormat((string) $data['booking_date'])) {
            $errors['booking_date'] = 'Format tanggal harus YYYY-MM-DD.';
        }

        if (isset($data['booking_time']) && !validateTimeFormat((string) $data['booking_time'])) {
            $errors['booking_time'] = 'Format waktu harus HH:MM atau HH:MM:SS.';
        }

        if (isset($data['vehicle_id']) && !$this->vehicleModel->findById((int) $data['vehicle_id'])) {
            $errors['vehicle_id'] = 'Data kendaraan tidak ditemukan.';
        }

        if (isset($data['workshop_id']) && !$this->workshopModel->exists((int) $data['workshop_id'])) {
            $errors['workshop_id'] = 'Data bengkel tidak ditemukan atau tidak aktif.';
        }

        if (!isset($data['service_ids']) || !is_array($data['service_ids']) || count($data['service_ids']) === 0) {
            $errors['service_ids'] = 'Pilih minimal satu layanan.';
            $services = [];
        } else {
            $services = $this->serviceModel->findManyByIds($data['service_ids']);

            if (count($services) !== count(array_unique(array_map('intval', $data['service_ids'])))) {
                $errors['service_ids'] = 'Satu atau beberapa layanan tidak valid.';
            }
        }

        if (count($errors) > 0) {
            errorResponse('Validasi booking gagal', $errors, 422);
        }

        $booking = $this->bookingModel->create($data, $services, (int) $user['id']);

        successResponse('Booking berhasil dibuat', $booking, 201);
    }

    public function updateStatus(string $id): void
    {
        // Hanya admin dan mekanik yang bisa mengupdate status
        $user = requireAdminOrMechanic($this->db);
        
        $data = getJsonInput();
        $errors = validateRequired($data, ['status']);

        if (isset($data['status']) && !validateBookingStatus((string) $data['status'])) {
            $errors['status'] = 'Status booking tidak valid.';
        }

        if (count($errors) > 0) {
            errorResponse('Validasi status gagal', $errors, 422);
        }

        if (!$this->bookingModel->findById($id)) {
            notFoundResponse('Booking tidak ditemukan');
        }

        $booking = $this->bookingModel->updateStatus($id, (string) $data['status']);

        successResponse('Status booking berhasil diperbarui', $booking);
    }
}