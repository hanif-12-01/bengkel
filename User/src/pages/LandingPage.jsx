import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Bike, Calendar, Clock, Wrench, ShieldCheck,
  ArrowRight, Plus, User, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { getBookings, getProfile, getVehicles } from '../lib/storage';

export default function LandingPage() {
  const navigate = useNavigate();
  const [vehicles] = useState(getVehicles);
  const [bookings] = useState(getBookings);
  const [profile] = useState(getProfile);

  const activeBookings = bookings.filter((booking) => booking.status === 'upcoming');

  const nearestUpcomingBooking = useMemo(() => {
    return [...activeBookings].sort((a, b) => {
      const left = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const right = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return left - right;
    })[0];
  }, [activeBookings]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <section className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-lg text-primary-foreground">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Premium</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Selamat Datang Kembali, {profile.fullName || 'Pelanggan'}!
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base">
            Pantau kendaraan, riwayat pemesanan, dan booking jadwal servis Anda berikutnya dengan lebih cepat.
          </p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-6 md:mt-0 w-full md:w-auto">
          <Button
            className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 font-bold px-6 py-5 rounded-xl shadow-md flex items-center justify-center space-x-2 animate-none"
            onClick={() => navigate('/dashboard/booking')}
          >
            <Plus className="w-5 h-5" />
            <span>Booking Servis</span>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-white/30 text-primary-foreground hover:bg-white/10 hover:text-white font-bold px-6 py-5 rounded-xl flex items-center justify-center space-x-2"
            onClick={() => navigate('/dashboard/vehicles')}
          >
            <Car className="w-5 h-5" />
            <span>Tambah Kendaraan</span>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kendaraan Terdaftar</p>
              <h3 className="text-2xl font-bold">{vehicles.length} Unit</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Booking Aktif</p>
              <h3 className="text-2xl font-bold">{activeBookings.length} Jadwal</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status Akun</p>
              <h3 className="text-2xl font-bold">Aktif</h3>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold">Jadwal Servis Terdekat</CardTitle>
                <CardDescription>Pemesanan servis yang sedang menunggu jadwal pengerjaan.</CardDescription>
              </div>
              {nearestUpcomingBooking && (
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full">
                  Menunggu
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {nearestUpcomingBooking ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/30 rounded-2xl border border-border/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{nearestUpcomingBooking.service}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{nearestUpcomingBooking.vehicle}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{nearestUpcomingBooking.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{nearestUpcomingBooking.time} WIB</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Estimasi Biaya</span>
                      <span className="text-base font-bold text-primary">{nearestUpcomingBooking.servicePrice}</span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="outline" size="sm" className="text-xs font-semibold flex items-center space-x-1" onClick={() => navigate('/dashboard/history')}>
                      <span>Lihat Semua Riwayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="font-semibold">Belum ada booking aktif.</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Buat jadwal servis pertama Anda.</p>
                  <Button onClick={() => navigate('/dashboard/booking')}>Booking Servis</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold">Garasi Saya</CardTitle>
                <CardDescription>Daftar kendaraan Anda yang terdaftar di SIMOBS.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-semibold flex items-center space-x-1" onClick={() => navigate('/dashboard/vehicles')}>
                <span>Kelola Garasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {vehicles.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Car className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Belum ada kendaraan terdaftar.</p>
                  <Button onClick={() => navigate('/dashboard/vehicles')}>Tambah Kendaraan</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30 rounded-2xl">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          {vehicle.type === 'Motor' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-text">{vehicle.brand} {vehicle.model}</h4>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-background border border-border rounded mt-1 inline-block">
                            {vehicle.plate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-lg font-bold">Menu Cepat</CardTitle>
              <CardDescription>Akses menu SIMOBS dalam satu klik.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {[
                { label: 'Booking Servis Baru', path: '/dashboard/booking', icon: Calendar },
                { label: 'Daftarkan Kendaraan', path: '/dashboard/vehicles', icon: Car },
                { label: 'Riwayat & Invoice', path: '/dashboard/history', icon: Wrench },
                { label: 'Pengaturan Profil', path: '/dashboard/profile', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.path} onClick={() => navigate(item.path)} className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium border border-border/20">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-surface to-background border border-border shadow-sm p-6 space-y-4">
            <h4 className="font-bold text-sm text-text flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>Layanan Pelanggan</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Butuh bantuan darurat di jalan? Hubungi tim support SIMOBS yang siap melayani Anda.
            </p>
            <div className="pt-2">
              <a href="tel:+628123456789" className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                Hubungi Support
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}