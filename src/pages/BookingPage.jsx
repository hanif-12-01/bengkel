import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Car, Wrench, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const VEHICLES = [
  { id: 1, name: 'Toyota Avanza (B 1234 ABC)' },
  { id: 2, name: 'Honda Brio (B 5678 DEF)' },
];

const SERVICES = [
  { id: 's1', name: 'Ganti Oli & Filter', price: 'Rp 150.000', icon: Wrench },
  { id: 's2', name: 'Service Berkala (Tune-up)', price: 'Rp 350.000', icon: Wrench },
  { id: 's3', name: 'Cek Kelistrikan', price: 'Rp 200.000', icon: Wrench },
  { id: 's4', name: 'Lainnya (Tuliskan masalah)', price: 'TBD', icon: Wrench },
];

const MECHANICS = [
  { id: 'm1', name: 'Budi (Ahli Mesin)' },
  { id: 'm2', name: 'Andi (Ahli Kelistrikan)' },
  { id: 'm3', name: 'Bebas (Siapa Saja)' },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleId: null,
    serviceId: null,
    date: '',
    time: '',
    mechanicId: 'm3',
    notes: '',
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStep1Valid = formData.vehicleId && formData.serviceId;
  const isStep2Valid = formData.date && formData.time && formData.mechanicId;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Booking Servis</h1>
        <p className="text-muted-foreground">Isi formulir di bawah ini untuk menjadwalkan servis kendaraan Anda.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        <div className={cn("px-3 py-1 rounded-full", step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>1. Kendaraan & Layanan</div>
        <div className="w-4 border-t border-border"></div>
        <div className={cn("px-3 py-1 rounded-full", step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted")}>2. Jadwal & Mekanik</div>
        <div className="w-4 border-t border-border"></div>
        <div className={cn("px-3 py-1 rounded-full", step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted")}>3. Konfirmasi</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Pilih Kendaraan dan Layanan'}
            {step === 2 && 'Pilih Tanggal, Waktu & Mekanik'}
            {step === 3 && 'Konfirmasi Booking'}
            {step === 4 && 'Booking Berhasil'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Pilih kendaraan dari garasi Anda dan layanan yang dibutuhkan.'}
            {step === 2 && 'Tentukan kapan Anda akan datang ke bengkel.'}
            {step === 3 && 'Periksa kembali detail booking Anda sebelum mengirim.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Pilih Kendaraan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VEHICLES.map((v) => (
                    <div 
                      key={v.id}
                      onClick={() => handleSelect('vehicleId', v.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3",
                        formData.vehicleId === v.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      <Car className="w-5 h-5 text-primary" />
                      <span className="font-medium">{v.name}</span>
                    </div>
                  ))}
                  <div className="p-4 rounded-xl border border-dashed border-border cursor-pointer hover:border-primary/50 flex items-center justify-center text-muted-foreground font-medium">
                    + Tambah Kendaraan Baru
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Pilih Layanan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <div 
                      key={s.id}
                      onClick={() => handleSelect('serviceId', s.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex flex-col space-y-1",
                        formData.serviceId === s.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center space-x-2">
                    <Calendar className="w-4 h-4" /> <span>Tanggal Servis</span>
                  </label>
                  <Input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => handleSelect('date', e.target.value)} 
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center space-x-2">
                    <Clock className="w-4 h-4" /> <span>Waktu Kedatangan</span>
                  </label>
                  <Input 
                    type="time" 
                    value={formData.time} 
                    onChange={(e) => handleSelect('time', e.target.value)} 
                    min="08:00" max="17:00"
                  />
                  <p className="text-xs text-muted-foreground">Jam operasional: 08:00 - 17:00</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <User className="w-4 h-4" /> <span>Pilih Mekanik (Opsional)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MECHANICS.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => handleSelect('mechanicId', m.id)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium text-center",
                        formData.mechanicId === m.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center space-x-2">
                  <span>Keluhan / Catatan Tambahan</span>
                </label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="Ceritakan masalah yang dialami kendaraan..."
                  value={formData.notes}
                  onChange={(e) => handleSelect('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kendaraan</p>
                    <p className="font-semibold text-lg">{VEHICLES.find(v => v.id === formData.vehicleId)?.name}</p>
                  </div>
                  <Car className="w-8 h-8 text-primary opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Layanan</p>
                    <p className="font-medium">{SERVICES.find(s => s.id === formData.serviceId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mekanik</p>
                    <p className="font-medium">{MECHANICS.find(m => m.id === formData.mechanicId)?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jadwal</p>
                    <p className="font-medium">{formData.date} | {formData.time} WIB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimasi Biaya</p>
                    <p className="font-bold text-primary">{SERVICES.find(s => s.id === formData.serviceId)?.price}</p>
                  </div>
                </div>
                {formData.notes && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Catatan Tambahan</p>
                    <p className="font-medium text-sm mt-1">{formData.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="terms" className="rounded text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor="terms" className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Saya menyetujui syarat & ketentuan booking bengkel.
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Booking Berhasil!</h2>
              <p className="text-muted-foreground max-w-md">
                Terima kasih, jadwal servis Anda telah tercatat. Mohon datang 15 menit sebelum jadwal (<strong>{formData.time} WIB</strong>) pada tanggal <strong>{formData.date}</strong>.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border p-6">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={prevStep}>
              Kembali
            </Button>
          )}
          {step === 1 && (
            <div className="w-full flex justify-end">
              <Button onClick={nextStep} disabled={!isStep1Valid}>
                Lanjutkan
              </Button>
            </div>
          )}
          {step === 2 && (
            <Button onClick={nextStep} disabled={!isStep2Valid}>
              Lanjutkan
            </Button>
          )}
          {step === 3 && (
            <Button onClick={nextStep} className="w-full sm:w-auto">
              Konfirmasi & Kirim Booking
            </Button>
          )}
          {step === 4 && (
            <Button className="w-full" onClick={() => window.location.href = '/'}>
              Kembali ke Beranda
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}