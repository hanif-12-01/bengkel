<?php

class Service
{
    public function __construct(private PDO $db)
    {
    }

    public function getAll(?string $vehicleType = null): array
    {
        $sql = 'SELECT * FROM services WHERE is_active = 1';
        $params = [];

        if ($vehicleType !== null && $vehicleType !== '') {
            $sql .= ' AND vehicle_type = :vehicle_type';
            $params['vehicle_type'] = normalizeVehicleType($vehicleType);
        }

        $sql .= ' ORDER BY vehicle_type ASC, name ASC';

        $statement = $this->db->prepare($sql);
        $statement->execute($params);

        return $statement->fetchAll();
    }

    public function findManyByIds(array $ids): array
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));

        if (count($ids) === 0) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $statement = $this->db->prepare("SELECT * FROM services WHERE is_active = 1 AND id IN ({$placeholders})");
        $statement->execute($ids);

        return $statement->fetchAll();
    }
}