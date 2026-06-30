import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Car, Bike, Wrench, Calendar, Clock, User, CheckCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  addBooking,
  formatVehicleLabel,
  generateBookingId,
  getVehicles,
  saveVehicles,
} from '../lib/storage';

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
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: null,
    serviceId: null,
    date: '',
    time: '',
    mechanicId: 'm3',
    notes: '',
  });

  const [vehicles, setVehicles] = useState(getVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [type, setType] = useState('Mobil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');

  const resetVehicleForm = () => {
    setType('Mobil');
    setBrand('');
    setModel('');
    setYear('');
    setPlate('');
    setColor('');
    setError('');
  };

  const handleOpenModal = () => {
    resetVehicleForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const normalizedPlate = plate.toUpperCase().trim();

    if (!brand.trim() || !model.trim() || !year.trim() || !normalizedPlate || !color.trim()) {
      setError('Semua kolom data kendaraan wajib diisi.');
      return;
    }

    if (vehicles.some((vehicle) => vehicle.plate.toUpperCase() === normalizedPlate)) {
      setError('Nomor polisi sudah terdaftar.');
      return;
    }

    const newVehicle = {
      id: Date.now(),
      type,
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      plate: normalizedPlate,
      color: color.trim(),
      lastService: 'Belum Servis',
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    saveVehicles(updated);
    setFormData((prev) => ({ ...prev, vehicleId: newVehicle.id }));
    setIsModalOpen(false);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const resetBooking = () => {
    setStep(1);
    setCreatedBooking(null);
    setAgreed(false);
    setFormData({
      vehicleId: null,
      serviceId: null,
      date: '',
      time: '',
      mechanicId: 'm3',
      notes: '',
    });
  };

  const handleConfirmBooking = () => {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === formData.vehicleId);
    const selectedService = SERVICES.find((service) => service.id === formData.serviceId);
    const selectedMechanic = MECHANICS.find((mechanic) => mechanic.id === formData.mechanicId);

    if (!selectedVehicle || !selectedService || !formData.date || !formData.time || !selectedMechanic) {
      return;
    }

    const booking = {
      id: generateBookingId(),
      vehicleId: selectedVehicle.id,
      vehicle: formatVehicleLabel(selectedVehicle),
      serviceId: selectedService.id,
      service: selectedService.name,
      servicePrice: selectedService.price,
      date: formData.date,
      time: formData.time,
      mechanicId: selectedMechanic.id,
      mechanic: selectedMechanic.name,
      notes: formData.notes.trim(),
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    setCreatedBooking(booking);
    setStep(4);
  };

  const isStep1Valid = formData.vehicleId && formData.serviceId;
  const isStep2Valid = formData.date && formData.time && formData.mechanicId;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text">Daftarkan Kendaraan Baru</h2>
              <button type="button" onClick={handleCloseModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Jenis Kendaraan</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Mobil', 'Motor'].map((vehicleType) => (
                    <button
                      key={vehicleType}
                      type="button"
                      onClick={() => setType(vehicleType)}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                        type === vehicleType ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {vehicleType === 'Motor' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                      <span>{vehicleType}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Merek {type}</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder={type === 'Mobil' ? 'Contoh: Toyota, Honda, Mitsubishi' : 'Contoh: Honda, Yamaha, Suzuki, Kawasaki'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Tipe / Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder={type === 'Mobil' ? 'Contoh: Avanza, Civic, Xpander' : 'Contoh: Beat, Vario, NMAX'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Tahun Kendaraan</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Contoh: 2021" min="1900" max={new Date().getFullYear() + 1} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Warna</label>
                  <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Contoh: Hitam, Silver" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nomor Polisi (Pelat Nomor)</label>
                <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Contoh: B 1234 ABC" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase text-sm font-semibold" required />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-3 border border-border hover:bg-muted text-text font-bold rounded-xl transition-all text-sm focus:outline-none">
                  Batal
                </button>
                <button type="submit" className="px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all text-sm focus:outline-none">
                  Simpan Kendaraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Booking Servis</h1>
        <p className="text-muted-foreground">Isi formulir di bawah ini untuk menjadwalkan servis kendaraan Anda.</p>
      </div>

      <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground overflow-x-auto">
        <div className={cn('px-3 py-1 rounded-full whitespace-nowrap', step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted')}>1. Kendaraan & Layanan</div>
        <div className="w-4 border-t border-border"></div>
        <div className={cn('px-3 py-1 rounded-full whitespace-nowrap', step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted')}>2. Jadwal & Mekanik</div>
        <div className="w-4 border-t border-border"></div>
        <div className={cn('px-3 py-1 rounded-full whitespace-nowrap', step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted')}>3. Konfirmasi</div>
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
            {step === 4 && createdBooking && `Nomor booking Anda: ${createdBooking.id}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Pilih Kendaraan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.map((v) => (
                    <div key={v.id} onClick={() => handleSelect('vehicleId', v.id)} className={cn('p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3', formData.vehicleId === v.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:border-primary/50')}>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {v.type === 'Motor' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-text">{v.brand} {v.model}</span>
                        <span className="text-xs text-muted-foreground">{v.plate} • {v.type || 'Mobil'}</span>
                      </div>
                    </div>
                  ))}
                  <div onClick={handleOpenModal} className="p-4 rounded-xl border border-dashed border-border cursor-pointer hover:border-primary hover:text-primary transition-all flex items-center justify-center text-muted-foreground font-bold text-sm bg-muted/20">
                    + Tambah Kendaraan Baru
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Pilih Layanan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <div key={s.id} onClick={() => handleSelect('serviceId', s.id)} className={cn('p-4 rounded-xl border cursor-pointer transition-all flex flex-col space-y-1', formData.serviceId === s.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:border-primary/50')}>
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
                  <label className="text-sm font-semibold flex items-center space-x-2"><Calendar className="w-4 h-4" /> <span>Tanggal Servis</span></label>
                  <Input type="date" value={formData.date} onChange={(e) => handleSelect('date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center space-x-2"><Clock className="w-4 h-4" /> <span>Waktu Kedatangan</span></label>
                  <Input type="time" value={formData.time} onChange={(e) => handleSelect('time', e.target.value)} min="08:00" max="17:00" />
                  <p className="text-xs text-muted-foreground">Jam operasional: 08:00 - 17:00</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center space-x-2"><User className="w-4 h-4" /> <span>Pilih Mekanik (Opsional)</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MECHANICS.map((m) => (
                    <div key={m.id} onClick={() => handleSelect('mechanicId', m.id)} className={cn('p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium text-center', formData.mechanicId === m.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:border-primary/50')}>
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Keluhan / Catatan Tambahan</label>
                <textarea className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" placeholder="Ceritakan masalah yang dialami kendaraan..." value={formData.notes} onChange={(e) => handleSelect('notes', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {(() => {
                const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
                const selectedService = SERVICES.find((s) => s.id === formData.serviceId);
                return (
                  <div className="bg-muted p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Kendaraan</p>
                        <p className="font-bold text-lg text-text">{formatVehicleLabel(selectedVehicle)}</p>
                      </div>
                      {selectedVehicle?.type === 'Motor' ? <Bike className="w-8 h-8 text-primary opacity-50" /> : <Car className="w-8 h-8 text-primary opacity-50" />}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Layanan</p>
                        <p className="font-medium">{selectedService?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mekanik</p>
                        <p className="font-medium">{MECHANICS.find((m) => m.id === formData.mechanicId)?.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Jadwal</p>
                        <p className="font-medium">{formData.date} | {formData.time} WIB</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimasi Biaya</p>
                        <p className="font-bold text-primary">{selectedService?.price}</p>
                      </div>
                    </div>
                    {formData.notes && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">Catatan Tambahan</p>
                        <p className="font-medium text-sm mt-1">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="booking-terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
                <label htmlFor="booking-terms" className="font-medium leading-none">Saya menyetujui syarat & ketentuan booking bengkel.</label>
              </div>
            </div>
          )}

          {step === 4 && createdBooking && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Booking Berhasil!</h2>
              <p className="text-muted-foreground max-w-md">
                Booking <strong>{createdBooking.id}</strong> sudah tersimpan. Mohon datang 15 menit sebelum jadwal (<strong>{createdBooking.time} WIB</strong>) pada tanggal <strong>{createdBooking.date}</strong>.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border p-6 gap-3">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={prevStep}>Kembali</Button>
          )}
          {step === 1 && (
            <div className="w-full flex justify-end">
              <Button onClick={nextStep} disabled={!isStep1Valid}>Lanjutkan</Button>
            </div>
          )}
          {step === 2 && (
            <Button onClick={nextStep} disabled={!isStep2Valid}>Lanjutkan</Button>
          )}
          {step === 3 && (
            <Button onClick={handleConfirmBooking} disabled={!agreed} className="w-full sm:w-auto">Konfirmasi & Kirim Booking</Button>
          )}
          {step === 4 && (
            <div className="w-full flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => navigate('/dashboard/history')}>Lihat History</Button>
              <Button onClick={resetBooking}>Buat Booking Lagi</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}