<?php

class Booking
{
    public function __construct(private PDO $db)
    {
    }

    public function getAll(?int $userId = null): array
    {
        $sql = 'SELECT
                    b.*,
                    v.vehicle_type,
                    v.brand AS vehicle_brand,
                    v.model AS vehicle_model,
                    v.year AS vehicle_year,
                    v.plate_number,
                    v.current_mileage,
                    w.name AS workshop_name,
                    w.address AS workshop_address
                 FROM bookings b
                 LEFT JOIN vehicles v ON v.id = b.vehicle_id
                 LEFT JOIN workshops w ON w.id = b.workshop_id';
        
        $params = [];
        if ($userId !== null) {
            $sql .= ' WHERE b.user_id = :user_id';
            $params['user_id'] = $userId;
        }
        
        $sql .= ' ORDER BY b.created_at DESC';

        $statement = $this->db->prepare($sql);
        $statement->execute($params);

        $bookings = $statement->fetchAll();

        return array_map(fn (array $booking) => $this->withServices($booking), $bookings);
    }

    public function findById(string $id): ?array
    {
        $statement = $this->db->prepare(
            'SELECT
                b.*,
                v.vehicle_type,
                v.brand AS vehicle_brand,
                v.model AS vehicle_model,
                v.year AS vehicle_year,
                v.plate_number,
                v.current_mileage,
                w.name AS workshop_name,
                w.address AS workshop_address
             FROM bookings b
             LEFT JOIN vehicles v ON v.id = b.vehicle_id
             LEFT JOIN workshops w ON w.id = b.workshop_id
             WHERE b.id = :id'
        );
        $statement->execute(['id' => $id]);

        $booking = $statement->fetch();

        return $booking ? $this->withServices($booking) : null;
    }

    public function create(array $data, array $services, ?int $userId = null): array
    {
        $bookingId = $this->generateBookingId();
        $estimatedMinPrice = array_sum(array_map(fn (array $service) => (float) $service['min_price'], $services));
        $estimatedMaxPrice = array_sum(array_map(fn (array $service) => (float) $service['max_price'], $services));

        $this->db->beginTransaction();

        try {
            $statement = $this->db->prepare(
                'INSERT INTO bookings
                    (id, user_id, customer_name, phone, email, vehicle_id, workshop_id, booking_date, booking_time, complaint_note, estimated_min_price, estimated_max_price, status)
                 VALUES
                    (:id, :user_id, :customer_name, :phone, :email, :vehicle_id, :workshop_id, :booking_date, :booking_time, :complaint_note, :estimated_min_price, :estimated_max_price, :status)'
            );

            $statement->execute([
                'id' => $bookingId,
                'user_id' => $userId,
                'customer_name' => trim((string) $data['customer_name']),
                'phone' => trim((string) $data['phone']),
                'email' => $data['email'] ?? null,
                'vehicle_id' => (int) $data['vehicle_id'],
                'workshop_id' => (int) $data['workshop_id'],
                'booking_date' => $data['booking_date'],
                'booking_time' => normalizeTime((string) $data['booking_time']),
                'complaint_note' => $data['complaint_note'] ?? null,
                'estimated_min_price' => $estimatedMinPrice,
                'estimated_max_price' => $estimatedMaxPrice,
                'status' => 'Menunggu Konfirmasi',
            ]);

            $serviceStatement = $this->db->prepare(
                'INSERT INTO booking_services
                    (booking_id, service_id, service_name, min_price, max_price)
                 VALUES
                    (:booking_id, :service_id, :service_name, :min_price, :max_price)'
            );

            foreach ($services as $service) {
                $serviceStatement->execute([
                    'booking_id' => $bookingId,
                    'service_id' => $service['id'],
                    'service_name' => $service['name'],
                    'min_price' => $service['min_price'],
                    'max_price' => $service['max_price'],
                ]);
            }

            $notificationStatement = $this->db->prepare(
                'INSERT INTO notification_logs (booking_id, message, channel, status)
                 VALUES (:booking_id, :message, :channel, :status)'
            );

            $notificationStatement->execute([
                'booking_id' => $bookingId,
                'message' => "Booking {$bookingId} berhasil dibuat dan menunggu konfirmasi admin.",
                'channel' => 'system',
                'status' => 'sent',
            ]);

            $this->db->commit();

            return $this->findById($bookingId);
        } catch (Throwable $exception) {
            $this->db->rollBack();
            throw $exception;
        }
    }

    public function updateStatus(string $id, string $status): ?array
    {
        $statement = $this->db->prepare('UPDATE bookings SET status = :status WHERE id = :id');
        $statement->execute([
            'id' => $id,
            'status' => $status,
        ]);

        if ($statement->rowCount() === 0) {
            return $this->findById($id);
        }

        return $this->findById($id);
    }

    private function withServices(array $booking): array
    {
        $statement = $this->db->prepare('SELECT * FROM booking_services WHERE booking_id = :booking_id ORDER BY id ASC');
        $statement->execute(['booking_id' => $booking['id']]);

        $booking['services'] = $statement->fetchAll();

        return $booking;
    }

    private function generateBookingId(): string
    {
        return 'BKG-' . date('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
    }
}