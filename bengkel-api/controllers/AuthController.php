<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validator.php';
require_once __DIR__ . '/../helpers/auth.php';

class AuthController
{
    private PDO $db;
    private User $userModel;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->userModel = new User($db);
    }

    public function register(): void
    {
        $data = getJsonInput();
        $errors = validateRequired($data, ['name', 'email', 'phone', 'password']);

        if (!empty($errors)) {
            errorResponse('Data tidak lengkap', $errors, 422);
        }

        if (!validateEmail($data['email'])) {
            $errors['email'] = 'Format email tidak valid.';
        }

        if (strlen((string) $data['password']) < 6) {
            $errors['password'] = 'Password minimal 6 karakter.';
        }

        if ($this->userModel->emailExists(trim((string) $data['email']))) {
            $errors['email'] = 'Email sudah terdaftar.';
        }

        if (!empty($errors)) {
            errorResponse('Validasi gagal', $errors, 422);
        }

        try {
            $this->db->beginTransaction();

            $user = $this->userModel->create([
                'name' => trim((string) $data['name']),
                'email' => trim((string) $data['email']),
                'phone' => trim((string) $data['phone']),
                'password' => (string) $data['password'],
                'role' => 'customer',
            ]);

            $token = $this->userModel->createToken((int) $user['id']);

            $this->db->commit();

            successResponse('Registrasi berhasil', [
                'user' => $this->userModel->publicData($user),
                'token' => $token,
            ], 201);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            errorResponse('Gagal mendaftarkan pengguna: ' . $e->getMessage(), [], 500);
        }
    }

    public function login(): void
    {
        $data = getJsonInput();
        $errors = validateRequired($data, ['email', 'password']);

        if (!empty($errors)) {
            errorResponse('Data tidak lengkap', $errors, 422);
        }

        if (!validateEmail($data['email'])) {
            errorResponse('Format email tidak valid', [
                'email' => 'Format email tidak valid.',
            ], 422);
        }

        $user = $this->userModel->findByEmail(trim((string) $data['email']));

        if (!$user || !password_verify((string) $data['password'], $user['password_hash'])) {
            errorResponse('Email atau password salah', [
                'auth' => 'Kredensial tidak valid.',
            ], 401);
        }

        try {
            $token = $this->userModel->createToken((int) $user['id']);

            successResponse('Login berhasil', [
                'user' => $this->userModel->publicData($user),
                'token' => $token,
            ]);
        } catch (Exception $e) {
            errorResponse('Gagal login: ' . $e->getMessage(), [], 500);
        }
    }

    public function me(): void
    {
        $user = requireAuth($this->db);

        successResponse('Data profil berhasil diambil', [
            'user' => $this->userModel->publicData($user),
        ]);
    }

    public function logout(): void
    {
        $token = getBearerToken();

        if ($token) {
            $this->userModel->deleteToken($token);
        }

        successResponse('Logout berhasil');
    }
}