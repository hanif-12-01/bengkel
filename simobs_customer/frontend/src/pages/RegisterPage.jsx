import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration
    navigate('/dashboard');
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
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nama Lengkap</label>
                <Input type="text" placeholder="Masukkan nama lengkap" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nomor Telepon</label>
                <Input type="tel" placeholder="0812xxxxxxxx" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input type="email" placeholder="nama@email.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <Input type="password" placeholder="Minimal 8 karakter" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Konfirmasi Password</label>
                <Input type="password" placeholder="Ulangi password" required />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="terms" required className="rounded text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Saya setuju dengan <Link to="#" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                </label>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                Daftar
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