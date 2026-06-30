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

        // Sanitasi string dan XSS Prevention
        $name = normalizeString($data['name'], 100);
        $email = normalizeString($data['email'], 100);
        $phone = normalizeString($data['phone'], 20);
        $password = (string)$data['password'];

        if (!validateEmail($email)) {
            $errors['email'] = 'Format email tidak valid.';
        }

        if (!validatePhoneIndonesia($phone)) {
            $errors['phone'] = 'Format nomor telepon tidak valid. Gunakan format Indonesia seperti 0812xxxxxxxx atau +628xxxxxxxx.';
        }

        if (!validatePassword($password)) {
            $errors['password'] = 'Password minimal 8 karakter dan harus mengandung kombinasi huruf dan angka.';
        }

        if (empty($errors) && $this->userModel->emailExists($email)) {
            $errors['email'] = 'Email sudah terdaftar.';
        }

        if (!empty($errors)) {
            errorResponse('Validasi gagal', $errors, 422);
        }

        try {
            $this->db->beginTransaction();

            $user = $this->userModel->create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'password' => $password,
                'role' => 'customer',
            ]);

            $token = $this->userModel->createToken((int)$user['id']);

            $this->db->commit();

            successResponse('Registrasi berhasil', [
                'user' => $this->userModel->publicData($user),
                'token' => $token,
            ], 201);
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            error_log("Error during registration: " . $e->getMessage());
            errorResponse('Gagal mendaftarkan pengguna.', [], 500);
        }
    }

    public function login(): void
    {
        $data = getJsonInput();
        $errors = validateRequired($data, ['email', 'password']);

        if (!empty($errors)) {
            errorResponse('Data tidak lengkap', $errors, 422);
        }

        $email = normalizeString($data['email'], 100);
        $password = (string)$data['password'];

        if (!validateEmail($email)) {
            errorResponse('Format email tidak valid', [
                'email' => 'Format email tidak valid.',
            ], 422);
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            // Defensive Programming: Pesan kesalahan umum yang aman untuk mencegah enumerasi akun
            errorResponse('Email atau password salah', [
                'auth' => 'Kredensial tidak valid.',
            ], 401);
        }

        try {
            $token = $this->userModel->createToken((int)$user['id']);

            successResponse('Login berhasil', [
                'user' => $this->userModel->publicData($user),
                'token' => $token,
            ]);
        } catch (Exception $e) {
            error_log("Error during login: " . $e->getMessage());
            errorResponse('Gagal login.', [], 500);
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
            // Defensive: sanitize token string
            $safeToken = preg_replace('/[^a-zA-Z0-9]/', '', $token);
            if ($safeToken) {
                $this->userModel->deleteToken($safeToken);
            }
        }

        successResponse('Logout berhasil');
    }
}