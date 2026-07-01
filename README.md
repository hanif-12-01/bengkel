# SIMOBS - Sistem Booking Servis Bengkel

A multi-component workshop booking application for cars and motorcycles, featuring a React + Vite frontend, a Laravel-based REST API, and a fallback raw PHP backend.

---

## Repository Structure

The project is organized into three main directories:

1. **`User/`**: The frontend application built with React, Vite, and Tailwind CSS.
2. **`backend/`**: The modern backend built with Laravel (PHP framework) using Eloquent ORM, Sanctum authentication, and structured migrations/seeders.
3. **`bengkel-api/`**: A lightweight custom PHP backend implementation serving as a secondary API option.

---

## 1. Frontend Setup (`User/`)

The frontend is a single-page application (SPA) with a responsive user interface designed for customer bookings and admin dashboard operations.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run
1. Navigate to the `User/` folder:
   ```bash
   cd User
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file by copying the example template:
   ```bash
   cp .env.local.example .env.local
   ```
   Modify `VITE_API_BASE_URL` inside `.env.local` to point to your backend API URL (e.g., `http://127.0.0.1:8000/api` for Laravel).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

---

## 2. Laravel Backend Setup (`backend/`)

The primary backend API built with Laravel 11.

### Prerequisites
- PHP >= 8.2
- Composer
- MySQL / MariaDB (via XAMPP, Laragon, or standalone)

### Installation & Run
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Generate application key:
   ```bash
   php artisan key:generate
   ```
4. Configure Database:
   Open the `.env` file and adjust your database connection parameters:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=bengkel_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Run migrations & seeders:
   This creates the database tables and populates initial seed data (users, workshops, services, spareparts, etc.):
   ```bash
   php artisan migrate --seed
   ```
6. Start the local server:
   ```bash
   php artisan serve
   ```
   The backend will start running at `http://127.0.0.1:8000`.

---

## 3. Custom PHP Backend Setup (`bengkel-api/`)

An alternative, lightweight custom PHP API located in `bengkel-api/`.

### Setup
1. Configure database credentials in `bengkel-api/config/database.php`.
2. Import the database schema from `bengkel-api/database.sql` into your local MySQL server.
3. Configure your local web server (like Apache in XAMPP) to serve the `bengkel-api/` directory, or run PHP's built-in server:
   ```bash
   cd bengkel-api
   php -S 127.0.0.1:8080