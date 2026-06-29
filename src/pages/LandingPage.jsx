import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, Bike, Calendar, Clock, Wrench, ShieldCheck, 
  ArrowRight, Plus, User, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const UPCOMING_BOOKING = {
  id: 'BK-1002',
  date: '2023-11-20',
  time: '14:00',
  vehicle: 'Toyota Avanza (B 1234 ABC)',
  service: 'Ganti Oli & Filter',
  status: 'upcoming',
  price: 'Rp 150.000'
};

const INITIAL_VEHICLES = [
  {
    id: 1,
    type: 'Mobil',
    brand: 'Toyota',
    model: 'Avanza',
    plate: 'B 1234 ABC',
  },
  {
    id: 2,
    type: 'Mobil',
    brand: 'Honda',
    model: 'Brio',
    plate: 'B 5678 DEF',
  },
  {
    id: 3,
    type: 'Motor',
    brand: 'Honda',
    model: 'Beat',
    plate: 'B 9876 XYZ',
  }
];

const getStoredVehicles = () => {
  const stored = localStorage.getItem('simobs_vehicles');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_VEHICLES;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [vehicles] = useState(getStoredVehicles);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-lg text-primary-foreground">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Premium</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Selamat Datang Kembali, John Doe!
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base">
            Pantau kondisi kendaraan, riwayat pemesanan, dan booking jadwal servis Anda berikutnya dengan lebih cepat.
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

      {/* Stats Summary Cards */}
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
              <h3 className="text-2xl font-bold">1 Jadwal</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Garansi Aktif</p>
              <h3 className="text-2xl font-bold">30 Hari</h3>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Upcoming Bookings & My Vehicles */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Booking Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold">Jadwal Servis Terdekat</CardTitle>
                <CardDescription>Pemesanan servis yang sedang menunggu jadwal pengerjaan.</CardDescription>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full">
                Menunggu
              </span>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/30 rounded-2xl border border-border/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">{UPCOMING_BOOKING.service}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{UPCOMING_BOOKING.vehicle}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" /> 
                        <span>{UPCOMING_BOOKING.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        <span>{UPCOMING_BOOKING.time} WIB</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Estimasi Biaya</span>
                  <span className="text-base font-bold text-primary">{UPCOMING_BOOKING.price}</span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs font-semibold flex items-center space-x-1"
                  onClick={() => navigate('/dashboard/history')}
                >
                  <span>Lihat Semua Riwayat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Registered Vehicles */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold">Garasi Saya</CardTitle>
                <CardDescription>Daftar kendaraan Anda yang terdaftar di SIMOBS.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-semibold flex items-center space-x-1"
                onClick={() => navigate('/dashboard/vehicles')}
              >
                <span>Kelola Garasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Quick Action Menu & Info */}
        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-lg font-bold">Menu Cepat</CardTitle>
              <CardDescription>Akses menu SIMOBS dalam satu klik.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <button 
                onClick={() => navigate('/dashboard/booking')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium border border-border/20"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm">Booking Servis Baru</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => navigate('/dashboard/vehicles')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium border border-border/20"
              >
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="text-sm">Daftarkan Kendaraan</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => navigate('/dashboard/history')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium border border-border/20"
              >
                <div className="flex items-center space-x-3">
                  <Wrench className="w-5 h-5 text-primary" />
                  <span className="text-sm">Riwayat & Invoice</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium border border-border/20"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-sm">Pengaturan Profil</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          {/* Quick Notice Card */}
          <Card className="bg-gradient-to-br from-surface to-background border border-border shadow-sm p-6 space-y-4">
            <h4 className="font-bold text-sm text-text flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>Layanan Pelanggan</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Butuh bantuan darurat di jalan? Atau ada pertanyaan seputar layanan kami? Hubungi tim support SIMOBS yang siap melayani Anda.
            </p>
            <div className="pt-2">
              <a 
                href="tel:+628123456789" 
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Hubungi Support
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
