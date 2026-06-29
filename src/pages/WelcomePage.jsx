import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Star, Shield, Clock, Award, Wrench, Car, 
  Droplets, Disc, BatteryCharging, Phone, MapPin, Mail,
  CheckCircle, ArrowRight, Sparkles, Users, Calendar
} from 'lucide-react';

// Animated counter hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return [count, setStarted];
}

const SERVICES = [
  { icon: Droplets, title: 'Ganti Oli & Filter', price: 'Mulai Rp 150.000', desc: 'Oli mesin premium berkualitas tinggi untuk performa optimal kendaraan Anda.', tag: 'Populer' },
  { icon: Wrench, title: 'Tune-up Mesin', price: 'Mulai Rp 350.000', desc: 'Kembalikan performa mesin seperti baru dengan tune-up komprehensif.', tag: 'Rekomendasi' },
  { icon: Disc, title: 'Rem & Ban', price: 'Mulai Rp 100.000', desc: 'Spooring, balancing, penggantian kampas rem, dan rotasi ban.', tag: null },
  { icon: BatteryCharging, title: 'Kelistrikan', price: 'Mulai Rp 200.000', desc: 'Diagnosa lengkap aki, alternator, starter, dan sistem kelistrikan.', tag: null },
  { icon: Car, title: 'Body Repair', price: 'Konsultasi', desc: 'Perbaikan body, cat, dan poles kendaraan dengan hasil premium.', tag: 'Premium' },
  { icon: Shield, title: 'Inspeksi Menyeluruh', price: 'Rp 250.000', desc: 'Pemeriksaan 50+ titik kendaraan untuk keamanan berkendara Anda.', tag: 'Baru' },
];

const REVIEWS = [
  { name: 'Budi Santoso', role: 'Pengusaha, Purwokerto', rating: 5, text: 'Bengkel paling profesional di Purwokerto. Sudah jadi langganan sejak 2018. Transparan dan hasil kerja selalu memuaskan.', vehicle: 'Toyota Fortuner' },
  { name: 'Siti Aminah', role: 'Dokter, Banyumas', rating: 5, text: 'Booking lewat SIMOBS sangat praktis! Tidak perlu antre, langsung dikerjakan begitu sampai di bengkel. Waktu saya sangat dihargai.', vehicle: 'Honda HR-V' },
  { name: 'Andi Wijaya', role: 'PNS, Purbalingga', rating: 5, text: 'Mekaniknya ahli dan ramah. Selalu diberi penjelasan detail tentang kondisi mobil. Harga sangat fair dan sesuai estimasi.', vehicle: 'Mitsubishi Xpander' },
  { name: 'Dewi Rahayu', role: 'Ibu Rumah Tangga', rating: 5, text: 'Sebagai wanita, saya merasa nyaman servis di sini. Tidak pernah dibohongi soal kerusakan. Sangat jujur dan terpercaya!', vehicle: 'Daihatsu Sigra' },
];

const STATS = [
  { label: 'Kendaraan Ditangani', value: 15000, suffix: '+' },
  { label: 'Pelanggan Puas', value: 8500, suffix: '+' },
  { label: 'Tahun Pengalaman', value: 12, suffix: '+' },
  { label: 'Mekanik Bersertifikat', value: 25, suffix: '' },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-primary tracking-tight">SIMOBS</span>
                <p className="text-[10px] text-muted-text uppercase tracking-widest font-semibold leading-none">Premium Auto Service</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#layanan" className="text-sm font-medium text-muted-text hover:text-primary transition-colors">Layanan</a>
              <a href="#keunggulan" className="text-sm font-medium text-muted-text hover:text-primary transition-colors">Keunggulan</a>
              <a href="#testimoni" className="text-sm font-medium text-muted-text hover:text-primary transition-colors">Testimoni</a>
              <a href="#kontak" className="text-sm font-medium text-muted-text hover:text-primary transition-colors">Kontak</a>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-4 py-2"
              >
                Masuk
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-primary">Bengkel Buka — Siap Menerima Booking Online</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-text mb-6">
              Bengkel Terpercaya
              <br />
              <span className="text-primary">No. 1 di Purwokerto</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-text max-w-2xl mx-auto leading-relaxed mb-10">
              Pesan layanan servis kendaraan secara online. Transparan, cepat, dan dikerjakan oleh 
              <span className="font-semibold text-text"> teknisi bersertifikat </span> 
              dengan peralatan modern.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Booking Sekarang
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-border text-text px-8 py-4 rounded-2xl text-lg font-bold hover:border-primary hover:text-primary transition-all"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-text font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos / Social Proof Bar */}
      <section className="border-y border-border/50 bg-surface/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-text">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent fill-current" />
              <span className="font-semibold text-sm">Rating 4.9/5 di Google</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Garansi 30 Hari</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Bengkel Resmi Bersertifikat</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">8500+ Pelanggan Setia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Layanan Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text mb-4">
              Layanan Bengkel Premium & Lengkap
            </h2>
            <p className="text-lg text-muted-text leading-relaxed">
              Dari perawatan rutin hingga perbaikan besar, semua ditangani oleh ahlinya dengan standar kualitas tertinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative bg-surface border border-border/60 rounded-2xl p-8 hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate('/register')}
                >
                  {service.tag && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        service.tag === 'Populer' ? 'bg-primary/15 text-primary' :
                        service.tag === 'Rekomendasi' ? 'bg-green-500/15 text-green-600' :
                        service.tag === 'Premium' ? 'bg-accent/15 text-accent' :
                        'bg-blue-500/15 text-blue-600'
                      }`}>
                        {service.tag}
                      </span>
                    </div>
                  )}
                  
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-text mb-2">{service.title}</h3>
                  <p className="text-primary font-bold text-sm mb-3">{service.price}</p>
                  <p className="text-muted-text text-sm leading-relaxed">{service.desc}</p>
                  
                  <div className="mt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Booking Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="keunggulan" className="py-20 md:py-28 bg-surface/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Mengapa SIMOBS?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text mb-6">
                Bengkel Modern dengan <span className="text-primary">Standar Tertinggi</span>
              </h2>
              <p className="text-lg text-muted-text leading-relaxed mb-10">
                Kami menggabungkan keahlian mekanik berpengalaman dengan teknologi terkini untuk memberikan layanan bengkel terbaik di Purwokerto dan sekitarnya.
              </p>

              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: 'Booking Online 24/7', desc: 'Pesan jadwal servis kapan saja, di mana saja melalui aplikasi SIMOBS.' },
                  { icon: CheckCircle, title: 'Estimasi Biaya Transparan', desc: 'Tidak ada biaya tersembunyi. Anda tahu persis berapa biaya sebelum servis dimulai.' },
                  { icon: CheckCircle, title: 'Garansi Servis 30 Hari', desc: 'Setiap pekerjaan kami jamin kualitasnya dengan garansi penuh 30 hari.' },
                  { icon: CheckCircle, title: 'Teknisi Bersertifikat', desc: 'Semua mekanik kami telah melewati pelatihan dan sertifikasi ketat.' },
                  { icon: CheckCircle, title: 'Spare Part Original', desc: 'Kami hanya menggunakan suku cadang asli dan berkualitas tinggi.' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="mt-0.5 text-primary flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-text leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-2xl"></div>
              <div className="relative bg-surface border border-border rounded-[2rem] p-8 md:p-10 shadow-xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-text mb-2">Booking dalam 3 Langkah</h3>
                  <p className="text-muted-text text-sm">Proses mudah dan cepat</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Pilih Layanan', desc: 'Tentukan jenis servis dan kendaraan Anda' },
                    { step: '02', title: 'Atur Jadwal', desc: 'Pilih tanggal dan waktu yang sesuai' },
                    { step: '03', title: 'Konfirmasi', desc: 'Datang ke bengkel sesuai jadwal, tanpa antre!' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-5 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-extrabold text-lg">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text">{item.title}</h4>
                        <p className="text-sm text-muted-text">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/register')}
                  className="w-full mt-8 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                >
                  Mulai Booking Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-1.5 rounded-full mb-4">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-semibold text-accent">Testimoni Pelanggan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text mb-4">
              Dipercaya Ribuan Pelanggan di Purwokerto
            </h2>
            <p className="text-lg text-muted-text leading-relaxed">
              Dengarkan langsung dari pelanggan setia kami yang telah merasakan layanan premium SIMOBS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="bg-surface border border-border/60 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-1 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                
                <p className="text-text text-base leading-relaxed mb-6 italic">"{review.text}"</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-text block">{review.name}</span>
                      <span className="text-xs text-muted-text font-medium">{review.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-text font-medium block">Kendaraan</span>
                    <span className="text-sm text-text font-semibold">{review.vehicle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-primary rounded-[2rem] p-10 md:p-20 text-center overflow-hidden">
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/3 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight mb-6">
                Siap Merawat Kendaraan Anda dengan yang Terbaik?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed">
                Bergabung dengan 8.500+ pelanggan yang sudah mempercayakan kendaraannya kepada SIMOBS. 
                Daftar gratis dan booking servis pertama Anda sekarang!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="group w-full sm:w-auto inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Daftar & Booking Gratis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href="tel:+628123456789"
                  className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/30 text-primary-foreground px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="kontak" className="py-20 md:py-28 bg-surface/50 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-primary">SIMOBS</span>
                  <p className="text-[10px] text-muted-text uppercase tracking-widest font-semibold leading-none">Premium Auto Service</p>
                </div>
              </div>
              <p className="text-muted-text leading-relaxed mb-6">
                Bengkel otomotif terpercaya dan terbesar di Purwokerto. Melayani perawatan dan perbaikan segala jenis kendaraan dengan standar kualitas tertinggi.
              </p>
              <div className="flex items-center space-x-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 text-sm font-semibold text-text">4.9 / 5.0</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-text mb-4">Kontak</h4>
              <div className="space-y-4">
                <a href="tel:+628123456789" className="flex items-center space-x-3 text-muted-text hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+62 812-3456-789</span>
                </a>
                <a href="mailto:info@simobs.id" className="flex items-center space-x-3 text-muted-text hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">info@simobs.id</span>
                </a>
                <div className="flex items-start space-x-3 text-muted-text">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Jl. Jenderal Soedirman No. 123, Purwokerto, Banyumas, Jawa Tengah</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-text mb-4">Jam Operasional</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-text">Senin - Jumat</span>
                  <span className="font-semibold text-text">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-text">Sabtu</span>
                  <span className="font-semibold text-text">08:00 - 15:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-text">Minggu</span>
                  <span className="font-semibold text-accent">Tutup</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-sm font-semibold text-primary">📞 Emergency 24 Jam</p>
                <p className="text-xs text-muted-text mt-1">Hubungi hotline darurat kami untuk bantuan di jalan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-text">
              &copy; {new Date().getFullYear()} SIMOBS Premium Auto Service. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-text">
              <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
