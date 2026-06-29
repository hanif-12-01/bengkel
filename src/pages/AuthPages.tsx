import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CarFront, KeyRound, ShieldCheck } from 'lucide-react';
import { Button, Card, FormInput, ToastView } from '../components/ui';
import { simobsApi } from '../services/simobsService';
import { useSimobs } from '../context/SimobsContext';

function AuthFrame({ title, subtitle, badge, children }: { title: string; subtitle: string; badge: string; children: React.ReactNode }) {
  const { toast } = useSimobs();
  return (
    <div className="min-h-screen px-4 py-8 text-text sm:px-6 lg:px-8">
      {toast && <ToastView key={toast.id} type={toast.type} message={toast.message} />}
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-3 rounded-[8px] border border-border bg-surface px-4 py-3 shadow-soft">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-accent text-accent-foreground"><CarFront className="h-6 w-6" /></div>
            <div>
              <p className="text-lg font-extrabold tracking-wide">SIMOBS</p>
              <p className="text-sm text-muted">Sistem Booking Servis Bengkel</p>
            </div>
          </div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-tight text-text">Platform booking servis bengkel untuk pelanggan dan operasional workshop.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">Kelola booking, status servis, sparepart, pelanggan, notifikasi, dan data admin dalam satu pengalaman modern yang siap untuk web, desktop, mobile, dan PWA.</p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {['OTP login', 'Status sinkron', 'Low stock alert'].map((item) => <Card key={item} className="p-4 text-sm font-semibold text-text">{item}</Card>)}
          </div>
        </section>
        <Card className="mx-auto w-full max-w-md p-6 sm:p-7">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">{badge}</div>
            <h2 className="text-2xl font-extrabold text-text">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}

export function CustomerLoginPage() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const pending = await simobsApi.customerLogin({ identifier, password });
      sessionStorage.setItem('simobs.pendingOtp', JSON.stringify(pending));
      notify('OTP berhasil dibuat. Periksa email atau kode demo lokal.', 'success');
      navigate('/verify-otp');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Login gagal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Masuk sebagai pelanggan" subtitle="Gunakan email atau nomor HP, lalu verifikasi OTP sebelum masuk dashboard." badge="Customer app">
      <form className="space-y-4" onSubmit={submit}>
        <FormInput label="Email atau nomor HP" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="nama@email.com atau +628..." required />
        <FormInput label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" required />
        <Button className="w-full" type="submit" loading={loading}><KeyRound className="h-4 w-4" /> Masuk dan kirim OTP</Button>
      </form>
      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted">
        <Link className="font-semibold text-accent" to="/register">Buat akun pelanggan</Link>
        <Link className="font-semibold text-accent" to="/admin/login">Masuk admin</Link>
      </div>
    </AuthFrame>
  );
}

export function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const [form, setForm] = useState({ nama: '', email: '', no_hp: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await simobsApi.customerRegister(form);
      notify('Registrasi berhasil. Silakan login untuk menerima OTP.', 'success');
      navigate('/login');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Registrasi gagal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Daftar pelanggan" subtitle="Akun baru otomatis tampil di data pelanggan admin sebagai pelanggan registrasi." badge="Registrasi customer">
      <form className="space-y-4" onSubmit={submit}>
        <FormInput label="Nama lengkap" value={form.nama} onChange={(event) => update('nama', event.target.value)} required />
        <FormInput label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
        <FormInput label="Nomor HP" value={form.no_hp} onChange={(event) => update('no_hp', event.target.value)} placeholder="08..." required />
        <FormInput label="Password" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} hint="Minimal 8 karakter" required />
        <FormInput label="Konfirmasi password" type="password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} required />
        <Button className="w-full" type="submit" loading={loading}>Daftar</Button>
      </form>
      <p className="mt-5 text-sm text-muted">Sudah punya akun? <Link className="font-semibold text-accent" to="/login">Masuk pelanggan</Link></p>
    </AuthFrame>
  );
}

export function OtpPage() {
  const navigate = useNavigate();
  const { notify, refreshSession } = useSimobs();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const pending = (() => {
    try { return JSON.parse(sessionStorage.getItem('simobs.pendingOtp') || 'null') as { pending_id: string; email: string; expires_at: string; dev_otp?: string } | null; }
    catch { return null; }
  })();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!pending) {
      notify('Sesi OTP tidak ditemukan. Silakan login ulang.', 'error');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await simobsApi.verifyCustomerOtp({ pending_id: pending.pending_id, otp });
      sessionStorage.removeItem('simobs.pendingOtp');
      await refreshSession();
      notify('OTP valid. Selamat datang di dashboard.', 'success');
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'OTP gagal diverifikasi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Verifikasi OTP" subtitle={`Masukkan 6 digit OTP untuk ${pending?.email ?? 'akun Anda'}. Kode berlaku 5 menit.`} badge="OTP customer">
      {pending?.dev_otp && (
        <div className="mb-4 rounded-[8px] border border-warning/30 bg-warning/10 p-3 text-sm text-text">
          Mode lokal: OTP demo <strong>{pending.dev_otp}</strong>. Di produksi, kode ini dikirim lewat email backend.
        </div>
      )}
      <form className="space-y-4" onSubmit={submit}>
        <FormInput label="Kode OTP" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" required />
        <Button className="w-full" type="submit" loading={loading}>Verifikasi dan masuk</Button>
      </form>
      <p className="mt-5 text-sm text-muted"><Link className="font-semibold text-accent" to="/login">Kembali ke login</Link></p>
    </AuthFrame>
  );
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { notify, refreshSession } = useSimobs();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await simobsApi.adminLogin({ username, password });
      await refreshSession();
      notify('Login admin berhasil.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Login admin gagal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Masuk admin bengkel" subtitle="Kelola booking, pelanggan, sparepart, dan status servis workshop." badge="Admin panel">
      <form className="space-y-4" onSubmit={submit}>
        <FormInput label="Username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <FormInput label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <Button className="w-full" type="submit" loading={loading}><ShieldCheck className="h-4 w-4" /> Masuk admin</Button>
      </form>
      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted">
        <Link className="font-semibold text-accent" to="/admin/register">Daftar admin</Link>
        <Link className="font-semibold text-accent" to="/login">Masuk pelanggan</Link>
      </div>
    </AuthFrame>
  );
}

export function AdminRegisterPage() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const [form, setForm] = useState({ nama: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await simobsApi.adminRegister(form);
      notify('Admin berhasil dibuat. Silakan login.', 'success');
      navigate('/admin/login');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Registrasi admin gagal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Daftar admin" subtitle="Buat akun workshop management. Password disimpan sebagai hash PBKDF2, bukan plaintext." badge="Registrasi admin">
      <form className="space-y-4" onSubmit={submit}>
        <FormInput label="Nama" value={form.nama} onChange={(event) => update('nama', event.target.value)} required />
        <FormInput label="Username" value={form.username} onChange={(event) => update('username', event.target.value)} required />
        <FormInput label="Password" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} hint="Minimal 8 karakter" required />
        <Button className="w-full" type="submit" loading={loading}>Daftar admin</Button>
      </form>
      <p className="mt-5 text-sm text-muted">Sudah punya akun? <Link className="font-semibold text-accent" to="/admin/login">Masuk admin</Link></p>
    </AuthFrame>
  );
}
