import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
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
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email atau No. Telepon</label>
                <Input type="text" placeholder="Masukkan email atau no. telepon" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Password</label>
                  <Link to="#" className="text-sm text-primary hover:underline">Lupa password?</Link>
                </div>
                <Input type="password" placeholder="Masukkan password" required />
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