import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { validateEmail, validateName, validatePhoneIndonesia } from "../lib/validation";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back ke halaman asal atau dashboard
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setError(null);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setFieldError(emailErr);
      toast.error(emailErr);
      return;
    }

    setSubmitting(true);

    try {
      await login(email);
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal masuk. Silakan periksa kembali email Anda.");
      toast.error("Gagal login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Atau{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              daftar akun baru di sini
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Masukkan email Anda (contoh: budi@gmail.com)"
              />
              {fieldError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldError}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Akun Uji Coba Demo:
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div>
                <span className="font-medium text-gray-800 dark:text-white">Admin:</span>{" "}
                <button
                  type="button"
                  onClick={() => setEmail("admin@bengkel.com")}
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
                >
                  admin@bengkel.com
                </button>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-white">Customer:</span>{" "}
                <button
                  type="button"
                  onClick={() => setEmail("budi@gmail.com")}
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
                >
                  budi@gmail.com
                </button>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-white">Mekanik:</span>{" "}
                <button
                  type="button"
                  onClick={() => setEmail("agus@bengkel.com")}
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
                >
                  agus@bengkel.com
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {submitting ? "Sedang masuk..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validasi client-side (Defensive Programming)
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhoneIndonesia(phone);

    if (nameErr || emailErr || phoneErr) {
      const newErrors: Record<string, string> = {};
      if (nameErr) newErrors.name = nameErr;
      if (emailErr) newErrors.email = emailErr;
      if (phoneErr) newErrors.phone = phoneErr;
      
      setFieldErrors(newErrors);
      const firstErr = nameErr || emailErr || phoneErr;
      toast.error(firstErr);
      return;
    }

    setSubmitting(true);

    try {
      await register({ name, email, phone });
      toast.success("Pendaftaran berhasil dan otomatis masuk!");
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registrasi gagal.");
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      toast.error("Gagal registrasi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              masuk di sini
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Lengkap
              </label>
              <input
                id="fullname"
                name="name"
                type="text"
                required
                disabled={submitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                placeholder="Budi Setiawan"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                placeholder="budi@gmail.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                No. Telepon / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                disabled={submitting}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                placeholder="081234567890"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {submitting ? "Sedang mendaftar..." : "Daftar Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar dari akun");
      navigate("/login");
    } catch (error) {
      toast.error("Gagal keluar dari akun");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="bg-indigo-600 px-6 py-12 text-white bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold text-white uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-indigo-200 capitalize font-medium">{user.role}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informasi Akun
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                {user.name}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Alamat Email
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No. Telepon / WhatsApp
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                {user.phone}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Peran Pengguna (Role)
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium capitalize">
                {user.role}
              </p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-4">
            <div className="flex gap-2">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Dashboard Admin
                </Link>
              )}
              {user.role === "customer" && (
                <Link
                  to="/booking"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Buat Booking Baru
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 font-medium rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};