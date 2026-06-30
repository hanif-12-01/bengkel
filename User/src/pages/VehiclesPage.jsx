import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Car, Bike, Info, Plus, Trash2, X, Pencil } from 'lucide-react';
import { getBookings, getVehicles, saveVehicles } from '../lib/storage';

const emptyForm = {
  id: null,
  type: 'Mobil',
  brand: '',
  model: '',
  year: '',
  plate: '',
  color: '',
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(getVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenModal = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setForm(vehicle ? { ...vehicle } : emptyForm);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateVehicle = () => {
    const normalizedPlate = form.plate.toUpperCase().trim();
    if (!form.brand.trim() || !form.model.trim() || !form.year.toString().trim() || !normalizedPlate || !form.color.trim()) {
      return 'Semua kolom data kendaraan wajib diisi.';
    }

    const duplicate = vehicles.some((vehicle) => vehicle.plate.toUpperCase() === normalizedPlate && vehicle.id !== editingVehicle?.id);
    if (duplicate) {
      return 'Nomor polisi sudah terdaftar.';
    }

    return '';
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    const validationMessage = validateVehicle();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const savedVehicle = {
      ...form,
      id: editingVehicle?.id || Date.now(),
      type: form.type,
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: form.year.toString().trim(),
      plate: form.plate.toUpperCase().trim(),
      color: form.color.trim(),
      lastService: editingVehicle?.lastService || 'Belum Servis',
    };

    const updated = editingVehicle
      ? vehicles.map((vehicle) => (vehicle.id === editingVehicle.id ? savedVehicle : vehicle))
      : [...vehicles, savedVehicle];

    setVehicles(updated);
    saveVehicles(updated);
    setSuccess(editingVehicle ? 'Data kendaraan berhasil diperbarui.' : 'Kendaraan berhasil ditambahkan.');
    setIsModalOpen(false);
  };

  const handleDeleteVehicle = (vehicle) => {
    const relatedBookings = getBookings().filter((booking) => String(booking.vehicleId) === String(vehicle.id));
    const message = relatedBookings.length > 0
      ? `Kendaraan ini memiliki ${relatedBookings.length} booking terkait. Tetap hapus kendaraan dari garasi?`
      : 'Apakah Anda yakin ingin menghapus kendaraan ini dari garasi?';

    if (window.confirm(message)) {
      const updated = vehicles.filter((item) => item.id !== vehicle.id);
      setVehicles(updated);
      saveVehicles(updated);
      setSuccess('Kendaraan berhasil dihapus.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Garasi Saya</h1>
          <p className="text-muted-foreground">Kelola data kendaraan Anda untuk memudahkan booking.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" /> <span>Tambah Kendaraan</span>
        </Button>
      </div>

      {success && (
        <div className="p-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium">
          {success}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Belum ada kendaraan terdaftar.</p>
          <Button onClick={() => handleOpenModal()}>Tambah Kendaraan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleOpenModal(vehicle)}
                  className="p-2 bg-background/90 hover:bg-primary hover:text-white rounded-full text-primary shadow-sm border border-border backdrop-blur-sm transition-all"
                  title="Edit Kendaraan"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle)}
                  className="p-2 bg-background/90 hover:bg-red-500 hover:text-white rounded-full text-red-500 shadow-sm border border-border backdrop-blur-sm transition-all"
                  title="Hapus Kendaraan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-6 pr-20">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {vehicle.type === 'Motor' ? <Bike className="w-8 h-8" /> : <Car className="w-8 h-8" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                        {vehicle.type || 'Mobil'}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nomor Polisi</p>
                    <p className="font-semibold px-3 py-1 bg-background border border-border rounded-md inline-block uppercase">
                      {vehicle.plate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Servis Terakhir</p>
                    <p className="font-medium flex items-center space-x-1 mt-1 text-sm">
                      <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{vehicle.lastService}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text">{editingVehicle ? 'Edit Kendaraan' : 'Daftarkan Kendaraan Baru'}</h2>
              <button onClick={handleCloseModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4">
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
                      onClick={() => updateForm('type', vehicleType)}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                        form.type === vehicleType
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {vehicleType === 'Motor' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                      <span>{vehicleType}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Merek {form.type}</label>
                <input type="text" value={form.brand} onChange={(e) => updateForm('brand', e.target.value)} placeholder={form.type === 'Mobil' ? 'Contoh: Toyota, Honda, Mitsubishi' : 'Contoh: Honda, Yamaha, Suzuki, Kawasaki'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Tipe / Model</label>
                <input type="text" value={form.model} onChange={(e) => updateForm('model', e.target.value)} placeholder={form.type === 'Mobil' ? 'Contoh: Avanza, Civic, Xpander' : 'Contoh: Beat, Vario, NMAX'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Tahun Kendaraan</label>
                  <input type="number" value={form.year} onChange={(e) => updateForm('year', e.target.value)} placeholder="Contoh: 2021" min="1900" max={new Date().getFullYear() + 1} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Warna</label>
                  <input type="text" value={form.color} onChange={(e) => updateForm('color', e.target.value)} placeholder="Contoh: Hitam, Silver" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-semibold" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Nomor Polisi (Pelat Nomor)</label>
                <input type="text" value={form.plate} onChange={(e) => updateForm('plate', e.target.value)} placeholder="Contoh: B 1234 ABC" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase text-sm font-semibold" required />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-3 border border-border hover:bg-muted text-text font-bold rounded-xl transition-all text-sm focus:outline-none">
                  Batal
                </button>
                <button type="submit" className="px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all text-sm focus:outline-none">
                  {editingVehicle ? 'Simpan Perubahan' : 'Simpan Kendaraan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}