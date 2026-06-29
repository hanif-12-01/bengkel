import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Wrench, CheckCircle, Clock3, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const BOOKINGS = [
  {
    id: 'BK-1002',
    date: '2023-11-20',
    time: '14:00',
    vehicle: 'Toyota Avanza (B 1234 ABC)',
    service: 'Ganti Oli & Filter',
    status: 'upcoming',
    price: 'Rp 150.000'
  },
  {
    id: 'BK-0985',
    date: '2023-10-05',
    time: '10:00',
    vehicle: 'Toyota Avanza (B 1234 ABC)',
    service: 'Service Berkala (Tune-up)',
    status: 'completed',
    price: 'Rp 450.000'
  },
  {
    id: 'BK-0842',
    date: '2023-08-12',
    time: '09:00',
    vehicle: 'Honda Brio (B 5678 DEF)',
    service: 'Cek Kelistrikan',
    status: 'cancelled',
    price: 'Rp 200.000'
  }
];

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  const filteredBookings = BOOKINGS.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusConfig = (status) => {
    switch(status) {
      case 'upcoming': return { icon: Clock3, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Menunggu' };
      case 'completed': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Selesai' };
      case 'cancelled': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Dibatalkan' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Servis</h1>
          <p className="text-muted-foreground">Pantau status booking dan riwayat perawatan kendaraan Anda.</p>
        </div>
        <Button>+ Booking Baru</Button>
      </div>

      <div className="flex space-x-2 border-b border-border">
        {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              filter === f 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {f === 'all' ? 'Semua' : f === 'upcoming' ? 'Akan Datang' : f === 'completed' ? 'Selesai' : 'Batal'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada riwayat servis untuk kategori ini.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                    
                    <div className="flex items-start space-x-4">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", statusConfig.bg, statusConfig.color)}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-lg">{booking.service}</h3>
                          <span className={cn("text-xs px-2 py-1 rounded-full font-semibold", statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">{booking.vehicle}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center space-x-1"><Calendar className="w-3 h-3"/> <span>{booking.date}</span></span>
                          <span className="flex items-center space-x-1"><Clock className="w-3 h-3"/> <span>{booking.time} WIB</span></span>
                          <span>| {booking.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                       <div className="text-left md:text-right">
                         <p className="text-xs text-muted-foreground">Total Biaya</p>
                         <p className="font-bold text-lg text-primary">{booking.price}</p>
                       </div>
                       {booking.status === 'upcoming' && (
                         <Button variant="outline" size="sm" className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                           Batalkan
                         </Button>
                       )}
                       {booking.status === 'completed' && (
                         <Button variant="outline" size="sm" className="mt-2">
                           Lihat Invoice
                         </Button>
                       )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}