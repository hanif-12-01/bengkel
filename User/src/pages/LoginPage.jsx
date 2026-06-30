import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { getProfile, saveSession } from '../lib/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError('Email/no. telepon dan password wajib diisi.');
      return;
    }

    const profile = getProfile();
    saveSession({
      isLoggedIn: true,
      identifier: identifier.trim(),
      fullName: profile.fullName,
      loginAt: new Date().toISOString(),
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">SIMOBS</h1>
          <p className="text-muted-foreground">Premium Auto Service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Selamat Datang Kembali</CardTitle>
            <CardDescription className="text-center">Masuk ke akun Anda untuk mulai booking.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email atau No. Telepon</label>
                <Input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Masukkan email atau no. telepon" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" required />
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                Masuk
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}