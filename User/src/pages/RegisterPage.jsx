import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState('');

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    if (!form.terms) {
      setError('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    try {
      await register({
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.confirmPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Registrasi gagal. Pastikan backend Laravel dan database aktif.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">SIMOBS</h1>
          <p className="text-muted-foreground">Premium Auto Service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Buat Akun Baru</CardTitle>
            <CardDescription className="text-center">Bergabunglah untuk menikmati layanan terbaik kami.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Nama Lengkap</label>
                <Input type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} placeholder="Masukkan nama lengkap" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nomor Telepon</label>
                <Input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="0812xxxxxxxx" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="nama@email.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <Input type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} placeholder="Minimal 8 karakter" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Konfirmasi Password</label>
                <Input type="password" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} placeholder="Ulangi password" required />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="terms" checked={form.terms} onChange={(e) => updateForm('terms', e.target.checked)} required className="rounded text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor="terms" className="text-sm leading-none">
                  Saya setuju dengan syarat penggunaan SIMOBS.
                </label>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
