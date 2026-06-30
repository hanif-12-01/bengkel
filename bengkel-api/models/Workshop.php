<?php

class Workshop
{
    public function __construct(private PDO $db)
    {
    }

    public function getAll(): array
    {
        $statement = $this->db->prepare("SELECT * FROM workshops WHERE status = 'Aktif' ORDER BY name ASC");
        $statement->execute();

        return $statement->fetchAll();
    }

    public function exists(int $id): bool
    {
        $statement = $this->db->prepare('SELECT COUNT(*) FROM workshops WHERE id = :id AND status = :status');
        $statement->execute([
            'id' => $id,
            'status' => 'Aktif',
        ]);

        return (int) $statement->fetchColumn() > 0;
    }
}