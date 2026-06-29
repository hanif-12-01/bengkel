import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Car, Info, Plus, Settings2, Trash2 } from 'lucide-react';

const MY_VEHICLES = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Avanza',
    year: '2019',
    plate: 'B 1234 ABC',
    color: 'Hitam',
    lastService: '2023-10-05',
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'Brio',
    year: '2021',
    plate: 'B 5678 DEF',
    color: 'Merah',
    lastService: '2023-08-12',
  }
];

export default function VehiclesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Garasi Saya</h1>
          <p className="text-muted-foreground">Kelola data kendaraan Anda untuk memudahkan booking.</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" /> <span>Tambah Kendaraan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MY_VEHICLES.map((vehicle) => (
          <Card key={vehicle.id} className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white/80 hover:bg-white rounded-full text-blue-600 shadow-sm backdrop-blur-sm">
                <Settings2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/80 hover:bg-white rounded-full text-red-600 shadow-sm backdrop-blur-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nomor Polisi</p>
                  <p className="font-semibold px-3 py-1 bg-background border border-border rounded-md inline-block">
                    {vehicle.plate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Servis Terakhir</p>
                  <p className="font-medium flex items-center space-x-1">
                    <Info className="w-3 h-3 text-primary" />
                    <span>{vehicle.lastService}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <button className="flex flex-col items-center justify-center min-h-[240px] rounded-xl border-2 border-dashed border-border bg-transparent hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground hover:border-primary/50">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Daftarkan Kendaraan Baru</span>
        </button>
      </div>
    </div>
  );
}