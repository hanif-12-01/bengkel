import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Info, Loader2, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Booking, BookingStatus, Product } from '../types';
import { formatRupiah, shortServiceId } from '../services/simobsService';

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'; size?: 'sm' | 'md' | 'icon'; loading?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[8px] border font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' && 'min-h-9 px-3 text-sm',
        size === 'md' && 'min-h-11 px-4 text-sm',
        size === 'icon' && 'h-10 w-10 p-0',
        variant === 'primary' && 'border-primary bg-primary text-primary-foreground shadow-soft hover:bg-primary-dark',
        variant === 'accent' && 'border-accent bg-accent text-accent-foreground shadow-soft hover:brightness-95',
        variant === 'secondary' && 'border-border bg-surface text-text hover:bg-surfaceSoft',
        variant === 'ghost' && 'border-transparent bg-transparent text-muted hover:bg-surfaceSoft hover:text-text',
        variant === 'danger' && 'border-danger bg-danger text-white hover:brightness-95',
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('app-card', className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">SIMOBS</p>
        <h1 className="mt-1 text-2xl font800 font-bold text-text sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = 'default', className }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-[8px] border px-2.5 py-1 text-xs font700 font-semibold',
      tone === 'default' && 'border-border bg-surfaceSoft text-muted',
      tone === 'success' && 'border-success/30 bg-success/10 text-success',
      tone === 'warning' && 'border-warning/35 bg-warning/12 text-warning',
      tone === 'danger' && 'border-danger/35 bg-danger/10 text-danger',
      tone === 'info' && 'border-info/35 bg-info/10 text-info',
      tone === 'accent' && 'border-accent/40 bg-accent/12 text-accent',
      className,
    )}>{children}</span>
  );
}

export function StatusBadge({ status }: { status?: BookingStatus | string }) {
  const value = status || 'Menunggu';
  const tone = value === 'Selesai' ? 'success' : value === 'Diproses' ? 'warning' : value === 'Ditunda' ? 'danger' : 'info';
  return <Badge tone={tone}>{value}</Badge>;
}

function FieldShell({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-text">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}

const inputClass = 'w-full rounded-[8px] border border-border bg-surface px-3.5 py-3 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10';

export function FormInput({ label, hint, error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  return <FieldShell label={label} hint={hint} error={error}><input className={cn(inputClass, className)} {...props} /></FieldShell>;
}

export function FormSelect({ label, hint, error, className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string; error?: string }) {
  return <FieldShell label={label} hint={hint} error={error}><select className={cn(inputClass, className)} {...props}>{children}</select></FieldShell>;
}

export function FormTextarea({ label, hint, error, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string }) {
  return <FieldShell label={label} hint={hint} error={error}><textarea className={cn(inputClass, 'min-h-[112px] resize-y', className)} {...props} /></FieldShell>;
}

export function SearchInput({ value, onChange, placeholder = 'Cari data...', onClear }: { value: string; onChange: (value: string) => void; placeholder?: string; onClear?: () => void }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input className={cn(inputClass, 'pl-9 pr-10')} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {value && <button type="button" onClick={onClear} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-[6px] text-muted hover:bg-surfaceSoft"><X className="h-4 w-4" /></button>}
    </div>
  );
}

export function Modal({ open, title, children, onClose, width = 'max-w-xl' }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void; width?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div className={cn('max-h-[92vh] w-full overflow-auto rounded-[8px] border border-border bg-surface p-5 shadow-2xl', width)} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-text">{title}</h2>
          <Button variant="ghost" size="icon" type="button" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, onCancel, onConfirm, loading }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void; loading?: boolean }) {
  return (
    <Modal open={open} title={title} onClose={onCancel} width="max-w-md">
      <p className="text-sm leading-6 text-muted">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Batal</Button>
        <Button variant="danger" type="button" loading={loading} onClick={onConfirm}>Hapus</Button>
      </div>
    </Modal>
  );
}

export function EmptyState({ icon: Icon = Info, title, message, action }: { icon?: LucideIcon; title: string; message?: string; action?: React.ReactNode }) {
  return (
    <Card className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-[8px] border border-border bg-surfaceSoft text-accent"><Icon className="h-6 w-6" /></div>
      <h3 className="mt-4 text-base font-bold text-text">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function LoadingSpinner({ label = 'Memuat data...' }: { label?: string }) {
  return <div className="flex min-h-[220px] items-center justify-center gap-3 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin text-accent" />{label}</div>;
}

export function StatCard({ title, value, icon: Icon, tone = 'accent' }: { title: string; value: string | number; icon: LucideIcon; tone?: 'accent' | 'success' | 'warning' | 'info' }) {
  const toneClass = tone === 'success' ? 'text-success bg-success/10' : tone === 'warning' ? 'text-warning bg-warning/10' : tone === 'info' ? 'text-info bg-info/10' : 'text-accent bg-accent/10';
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text">{value}</p>
        </div>
        <div className={cn('grid h-12 w-12 place-items-center rounded-[8px]', toneClass)}><Icon className="h-6 w-6" /></div>
      </div>
    </Card>
  );
}

export function ToastView({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) {
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertTriangle : Info;
  return (
    <div className="fixed right-4 top-4 z-[60] flex max-w-sm items-start gap-3 rounded-[8px] border border-border bg-surface p-4 text-sm text-text shadow-2xl">
      <Icon className={cn('mt-0.5 h-5 w-5', type === 'success' && 'text-success', type === 'error' && 'text-danger', type === 'info' && 'text-info')} />
      <span className="leading-5">{message}</span>
    </div>
  );
}

export function Timeline({ status }: { status: BookingStatus }) {
  const steps: Array<{ key: BookingStatus | 'Dibuat'; label: string }> = [
    { key: 'Dibuat', label: 'Booking dibuat' },
    { key: 'Menunggu', label: 'Menunggu antrian' },
    { key: 'Diproses', label: 'Diproses mekanik' },
    { key: 'Selesai', label: 'Selesai' },
  ];
  const activeIndex = status === 'Selesai' ? 3 : status === 'Diproses' ? 2 : 1;
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-3">
          <div className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold', index <= activeIndex ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-surfaceSoft text-muted')}>{index + 1}</div>
          <div className={cn('text-sm font-semibold', index <= activeIndex ? 'text-text' : 'text-muted')}>{step.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-text">{product.name}</h3>
          <p className="mt-1 text-sm text-muted">{product.suitableFor}</p>
        </div>
        <Badge tone="accent">{formatRupiah(product.price)}</Badge>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-muted">{product.description}</p>
      <div className="mt-4 rounded-[8px] border border-border bg-surfaceSoft p-3 text-xs font-semibold text-text">{product.replacement}</div>
    </Card>
  );
}

export function BookingCard({ booking, action }: { booking: Booking; action?: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-text">{booking.jenis_servis || 'Servis Bengkel'}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{shortServiceId(booking.id)} - {booking.motor} - {booking.plat || 'Plat belum diisi'}</p>
          <p className="mt-3 text-sm leading-6 text-text">{booking.keluhan}</p>
        </div>
        {action}
      </div>
      <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
        <div><span className="block text-xs uppercase tracking-wide text-muted/80">Tanggal</span><strong className="text-text">{booking.tanggal || '-'}</strong></div>
        <div><span className="block text-xs uppercase tracking-wide text-muted/80">Waktu</span><strong className="text-text">{booking.waktu || '-'}</strong></div>
        <div><span className="block text-xs uppercase tracking-wide text-muted/80">Mekanik</span><strong className="text-text">{booking.mekanik || 'Belum ditentukan'}</strong></div>
      </div>
    </Card>
  );
}
