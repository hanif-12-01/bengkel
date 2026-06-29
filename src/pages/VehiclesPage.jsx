import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Car, Bike, Info, Plus, Settings2, Trash2, X } from 'lucide-react';

const INITIAL_VEHICLES = [
  {
    id: 1,
    type: 'Mobil',
    brand: 'Toyota',
    model: 'Avanza',
    year: '2019',
    plate: 'B 1234 ABC',
    color: 'Hitam',
    lastService: '2023-10-05',
  },
  {
    id: 2,
    type: 'Mobil',
    brand: 'Honda',
    model: 'Brio',
    year: '2021',
    plate: 'B 5678 DEF',
    color: 'Merah',
    lastService: '2023-08-12',
  },
  {
    id: 3,
    type: 'Motor',
    brand: 'Honda',
    model: 'Beat',
    year: '2020',
    plate: 'B 9876 XYZ',
    color: 'Biru',
    lastService: '2023-09-20',
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
  localStorage.setItem('simobs_vehicles', JSON.stringify(INITIAL_VEHICLES));
  return INITIAL_VEHICLES;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(getStoredVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [type, setType] = useState('Mobil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    setType('Mobil');
    setBrand('');
    setModel('');
    setYear('');
    setPlate('');
    setColor('');
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    
    if (!brand.trim() || !model.trim() || !year.trim() || !plate.trim() || !color.trim()) {
      setError('Semua kolom data kendaraan wajib diisi.');
      return;
    }

    const newVehicle = {
      id: Date.now(),
      type: type,
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      plate: plate.toUpperCase().trim(),
      color: color.trim(),
      lastService: 'Belum Servis',
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    localStorage.setItem('simobs_vehicles', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kendaraan ini dari garasi?')) {
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      localStorage.setItem('simobs_vehicles', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Garasi Saya</h1>
          <p className="text-muted-foreground">Kelola data kendaraan Anda untuk memudahkan booking.</p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" /> <span>Tambah Kendaraan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="p-2 bg-background/90 hover:bg-red-500 hover:text-white rounded-full text-red-500 shadow-sm border border-border backdrop-blur-sm transition-all"
                title="Hapus Kendaraan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {vehicle.type === 'Motor' ? <Bike className="w-8 h-8" /> : <Car className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
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

      {/* Modal / Dialog for registering a new vehicle */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text">Daftarkan Kendaraan Baru</h2>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                  Jenis Kendaraan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('Mobil')}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      type === 'Mobil'
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                        : 'border-border bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Mobil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Motor')}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      type === 'Motor'
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                        : 'border-border bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Motor</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                  Merek {type}
                </label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={type === 'Mobil' ? "Contoh: Toyota, Honda, Mitsubishi" : "Contoh: Honda, Yamaha, Suzuki, Kawasaki"}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-text placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                  Tipe / Model
                </label>
                <input 
                  type="text" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={type === 'Mobil' ? "Contoh: Avanza, Civic, Xpander" : "Contoh: Beat, Vario, NMAX"}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-text placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                    Tahun Kendaraan
                  </label>
                  <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Contoh: 2021"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-text placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                    Warna
                  </label>
                  <input 
                    type="text" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Contoh: Hitam, Silver"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-text placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                  Nomor Polisi (Pelat Nomor)
                </label>
                <input 
                  type="text" 
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="Contoh: B 1234 ABC"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-text placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all uppercase text-sm"
                  required
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-3 border border-border hover:bg-muted text-text font-bold rounded-xl transition-all text-sm focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all text-sm focus:outline-none"
                >
                  Simpan Kendaraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
