import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, PenToolIcon as Tool, Wrench, BatteryCharging, Disc, Droplets, ChevronRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const SERVICES = [
  { icon: Droplets, title: 'Oil Change', price: 'Mulai Rp 150.000', desc: 'Ganti oli mesin & filter dengan oli premium berkualitas.' },
  { icon: Disc, title: 'Tire & Brake', price: 'Mulai Rp 100.000', desc: 'Cek kondisi ban, spooring, balancing, dan kampas rem.' },
  { icon: Wrench, title: 'Engine Tune-up', price: 'Mulai Rp 350.000', desc: 'Performa mesin kembali maksimal seperti mobil baru.' },
  { icon: BatteryCharging, title: 'Electrical Check', price: 'Mulai Rp 200.000', desc: 'Pengecekan aki, alternator, dan kelistrikan mobil.' },
];

const REVIEWS = [
  { name: 'Budi Santoso', rating: 5, text: 'Pelayanan sangat profesional dan transparan. Mobil saya kembali enak dipakai.' },
  { name: 'Siti Aminah', rating: 5, text: 'Booking lewat aplikasi sangat mudah. Tidak perlu antre lama di bengkel.' },
  { name: 'Andi Wijaya', rating: 4, text: 'Mekanik andal dan ramah. Harga juga sesuai dengan estimasi awal.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-16 pb-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-primary p-10 md:p-16 lg:p-24 flex flex-col items-center text-center shadow-premium transition-all">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-primary-foreground/90 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
            <span>Bengkel Buka - Siap Menerima Booking</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-primary-foreground">
            Premium Auto Service, <br className="hidden md:block"/> Tanpa Antre.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Pesan layanan bengkel profesional dengan mudah. Transparan, cepat, dan dikerjakan oleh teknisi bersertifikat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 shadow-xl" onClick={() => navigate('/booking')}>
              Booking Sekarang <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-primary-foreground hover:bg-white/10 hover:text-white backdrop-blur-sm">
              Lihat Layanan
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: 'Garansi Servis', desc: 'Semua layanan kami dilindungi oleh garansi resmi selama 30 hari.' },
          { icon: Clock, title: 'Tepat Waktu', desc: 'Sistem booking memastikan mobil Anda dikerjakan tepat pada waktunya.' },
          { icon: Tool, title: 'Mekanik Ahli', desc: 'Dikerjakan oleh teknisi bersertifikat dengan peralatan modern.' }
        ].map((benefit, i) => (
          <div key={i} className="flex items-start space-x-5 p-8 bg-surface rounded-3xl border border-border/60 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <benefit.icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-text">{benefit.title}</h3>
              <p className="text-muted leading-relaxed">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text">Layanan Unggulan</h2>
            <p className="text-muted text-lg">Pilih layanan yang sesuai dengan kebutuhan kendaraan Anda.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => (
            <Card key={idx} className="group cursor-pointer hover:border-primary/50" onClick={() => navigate('/booking')}>
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-text mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <service.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl mb-1">{service.title}</CardTitle>
                <CardDescription className="text-accent font-semibold text-base">{service.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted leading-relaxed">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-10 bg-surface border border-border/50 p-8 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="text-center max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-text">Dipercaya oleh Pelanggan</h2>
          <p className="text-muted text-lg">Ratusan kendaraan telah kami tangani dengan standar kepuasan tinggi.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-background rounded-3xl p-8 border border-border/40 shadow-sm hover:shadow-premium transition-all">
              <div className="flex items-center space-x-1 mb-6 text-accent">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-base leading-relaxed italic text-text mb-8">"{review.text}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
                  {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-text">{review.name}</span>
                  <span className="text-xs text-muted font-medium">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-surface to-background border border-border rounded-[2.5rem] p-10 md:p-20 text-center space-y-8 shadow-premium relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-text tracking-tight leading-tight">Siap Mengembalikan Performa Kendaraan Anda?</h2>
          <p className="text-muted text-xl leading-relaxed">
            Jangan tunggu sampai mobil Anda bermasalah. Lakukan perawatan rutin sekarang juga melalui aplikasi SIMOBS.
          </p>
          <Button size="lg" onClick={() => navigate('/booking')} className="shadow-lg px-8 h-14 text-lg">
            Mulai Booking Servis <ChevronRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>
    </div>
  );
}