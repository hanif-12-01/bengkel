<?php

class User
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function create(array $data): array
    {
        $statement = $this->db->prepare(
            'INSERT INTO users (name, email, phone, password_hash, role)
             VALUES (:name, :email, :phone, :password_hash, :role)'
        );

        $statement->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            ':role' => $data['role'] ?? 'customer',
        ]);

        return $this->findById((int) $this->db->lastInsertId());
    }

    public function findById(int $id): ?array
    {
        $statement = $this->db->prepare(
            'SELECT id, name, email, phone, role, created_at, updated_at
             FROM users
             WHERE id = :id
             LIMIT 1'
        );

        $statement->execute([':id' => $id]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $statement = $this->db->prepare(
            'SELECT id, name, email, phone, password_hash, role, created_at, updated_at
             FROM users
             WHERE email = :email
             LIMIT 1'
        );

        $statement->execute([':email' => $email]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function emailExists(string $email): bool
    {
        $statement = $this->db->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
        $statement->execute([':email' => $email]);

        return (int) $statement->fetchColumn() > 0;
    }

    public function createToken(int $userId): string
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

        $statement = $this->db->prepare(
            'INSERT INTO user_tokens (user_id, token, expires_at)
             VALUES (:user_id, :token, :expires_at)'
        );

        $statement->execute([
            ':user_id' => $userId,
            ':token' => $token,
            ':expires_at' => $expiresAt,
        ]);

        return $token;
    }

    public function findByToken(string $token): ?array
    {
        $statement = $this->db->prepare(
            'SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at, u.updated_at
             FROM user_tokens ut
             INNER JOIN users u ON u.id = ut.user_id
             WHERE ut.token = :token
               AND ut.expires_at > NOW()
             LIMIT 1'
        );

        $statement->execute([':token' => $token]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function deleteToken(string $token): bool
    {
        $statement = $this->db->prepare('DELETE FROM user_tokens WHERE token = :token');

        return $statement->execute([':token' => $token]);
    }

    public function deleteExpiredTokens(): void
    {
        $this->db->exec('DELETE FROM user_tokens WHERE expires_at <= NOW()');
    }

    public function publicData(array $user): array
    {
        unset($user['password_hash']);

        return $user;
    }
}