import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Wrench, CheckCircle, Clock3, XCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { getBookings, updateBookingStatus } from '../lib/storage';

const SAMPLE_BOOKINGS = [
  {
    id: 'BK-SAMPLE-1002',
    date: '2023-11-20',
    time: '14:00',
    vehicle: 'Toyota Avanza (B 1234 ABC)',
    service: 'Ganti Oli & Filter',
    servicePrice: 'Rp 150.000',
    mechanic: 'Bebas (Siapa Saja)',
    notes: 'Contoh data riwayat.',
    status: 'completed',
    createdAt: '2023-11-18T09:00:00.000Z',
  },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState(getBookings);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const hasRealBookings = bookings.length > 0;
  const displayBookings = hasRealBookings ? bookings : SAMPLE_BOOKINGS;

  const filteredBookings = useMemo(() => {
    return displayBookings.filter((booking) => {
      if (filter === 'all') return true;
      return booking.status === filter;
    });
  }, [displayBookings, filter]);

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Batalkan booking ini?')) return;
    const updated = updateBookingStatus(bookingId, 'cancelled');
    setBookings(updated);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'upcoming':
        return { icon: Clock3, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Menunggu' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Selesai' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Dibatalkan' };
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {selectedInvoice && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Invoice Booking</h2>
                <p className="text-sm text-muted-foreground">{selectedInvoice.id}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['Kendaraan', selectedInvoice.vehicle],
                ['Layanan', selectedInvoice.service],
                ['Jadwal', `${selectedInvoice.date} - ${selectedInvoice.time} WIB`],
                ['Mekanik', selectedInvoice.mechanic || '-'],
                ['Harga', selectedInvoice.servicePrice || selectedInvoice.price || '-'],
                ['Status', getStatusConfig(selectedInvoice.status).label],
                ['Catatan', selectedInvoice.notes || '-'],
                ['Dibuat', selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleString('id-ID') : '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedInvoice(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Servis</h1>
          <p className="text-muted-foreground">Pantau status booking dan riwayat perawatan kendaraan Anda.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/booking')}>+ Booking Baru</Button>
      </div>

      {!hasRealBookings && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm">
          Belum ada booking tersimpan. Data di bawah hanya contoh riwayat.
        </div>
      )}

      <div className="flex space-x-2 border-b border-border overflow-x-auto">
        {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              filter === f
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
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
            <Button className="mt-4" onClick={() => navigate('/dashboard/booking')}>Buat Booking</Button>
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
                      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', statusConfig.bg, statusConfig.color)}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 className="font-bold text-lg">{booking.service}</h3>
                          <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">{booking.vehicle}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2 flex-wrap gap-y-1">
                          <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /> <span>{booking.date}</span></span>
                          <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /> <span>{booking.time} WIB</span></span>
                          <span>| {booking.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 gap-2">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Total Biaya</p>
                        <p className="font-bold text-lg text-primary">{booking.servicePrice || booking.price}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(booking)}>
                          Lihat Invoice
                        </Button>
                        {booking.status === 'upcoming' && hasRealBookings && (
                          <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                            Batalkan
                          </Button>
                        )}
                      </div>
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