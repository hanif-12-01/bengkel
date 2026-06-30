<?php

class Vehicle
{
    public function __construct(private PDO $db)
    {
    }

    public function create(array $data): int
    {
        $statement = $this->db->prepare(
            'INSERT INTO vehicles
                (user_id, vehicle_type, brand, model, year, plate_number, current_mileage)
             VALUES
                (:user_id, :vehicle_type, :brand, :model, :year, :plate_number, :current_mileage)'
        );

        $statement->execute([
            'user_id' => $data['user_id'] ?? null,
            'vehicle_type' => normalizeVehicleType((string) $data['vehicle_type']),
            'brand' => trim((string) $data['brand']),
            'model' => trim((string) $data['model']),
            'year' => (int) $data['year'],
            'plate_number' => strtoupper(trim((string) $data['plate_number'])),
            'current_mileage' => (int) ($data['current_mileage'] ?? 0),
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM vehicles WHERE id = :id');
        $statement->execute(['id' => $id]);

        $vehicle = $statement->fetch();

        return $vehicle ?: null;
    }
}