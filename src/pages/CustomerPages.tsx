import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  Bike,
  CalendarClock,
  Car,
  CheckCircle2,
  ClipboardList,
  Edit3,
  History,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import {
  mobilModels,
  serviceTypesMobil,
  serviceTypesMotor,
  vehicleModels,
} from "../data/catalog";
import { useSimobs } from "../context/SimobsContext";
import {
  formatRupiah,
  shortServiceId,
  simobsApi,
} from "../services/simobsService";
import type {
  Booking,
  DashboardPayload,
  NotificationRecord,
  ProductCategory,
  ThemePreference,
  User as SimobsUser,
  VehicleProfile,
  VehicleRecord,
  VehicleType,
} from "../types";
import {
  Badge,
  BookingCard,
  Button,
  Card,
  EmptyState,
  FormInput,
  FormSelect,
  FormTextarea,
  LoadingSpinner,
  Modal,
  PageHeader,
  ProductCard,
  SearchInput,
  StatusBadge,
  Timeline,
} from "../components/ui";

function useLoad<T>(loader: () => Promise<T>, deps: React.DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    reload();
  }, deps);
  return { data, loading, error, reload };
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <EmptyState
      title="Terjadi kendala"
      message={message}
      action={<Button onClick={onRetry}>Muat ulang</Button>}
    />
  );
}

export function CustomerDashboardPage() {
  const { data, loading, error, reload } = useLoad<DashboardPayload>(
    () => simobsApi.customerDashboard(),
    [],
  );
  const actions = [
    {
      label: "Booking Servis",
      to: "/app/booking",
      icon: CalendarClock,
      tone: "bg-accent/12 text-accent",
    },
    {
      label: "Status Servis",
      to: "/app/status",
      icon: ClipboardList,
      tone: "bg-info/10 text-info",
    },
    {
      label: "Riwayat Servis",
      to: "/app/history",
      icon: History,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Spare Parts",
      to: "/app/spareparts",
      icon: Package,
      tone: "bg-warning/10 text-warning",
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader
        title={`Halo, ${data.nama}`}
        subtitle="Pantau servis kendaraan, buat booking baru, dan cek sparepart bengkel dalam satu dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((item) => (
          <Link key={item.to} to={item.to}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-premium">
              <div
                className={`grid h-11 w-11 place-items-center rounded-[8px] ${item.tone}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-text">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Akses cepat untuk kebutuhan servis Anda.
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text">
                Catatan Servis Terakhir
              </h2>
              <p className="text-sm text-muted">
                Ringkasan booking terbaru Anda.
              </p>
            </div>
            <Badge tone="accent">Live sync</Badge>
          </div>
          {data.lastBooking ? (
            <BookingCard booking={data.lastBooking} />
          ) : (
            <EmptyState
              title="Belum ada catatan servis"
              message="Buat booking pertama Anda agar bengkel dapat menyiapkan slot servis."
              action={
                <Link to="/app/booking">
                  <Button>
                    <Plus className="h-4 w-4" /> Booking Servis
                  </Button>
                </Link>
              }
            />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-accent/12 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Tawaran Spesial</h2>
              <p className="text-sm text-muted">Promo aktif dari bengkel.</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.promos.length ? (
              data.promos.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-[8px] border border-border bg-surfaceSoft p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-text">
                        {promo.judul || promo.nama}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {promo.deskripsi}
                      </p>
                    </div>
                    {promo.diskon ? (
                      <Badge tone="warning">Diskon {promo.diskon}%</Badge>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">
                Belum ada tawaran spesial saat ini.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

const initialBooking = {
  motor: "",
  plat: "",
  jenis_servis: "",
  tanggal: "",
  waktu: "",
  keluhan: "",
  jenis_kendaraan: "motor" as VehicleType,
};

export function CustomerBookingPage() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const [form, setForm] = useState(initialBooking);
  const [step, setStep] = useState<"form" | "success">("form");
  const location = useLocation();
  const [created, setCreated] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const currentModels =
    form.jenis_kendaraan === "mobil" ? mobilModels : vehicleModels;
  const currentServiceTypes =
    form.jenis_kendaraan === "mobil" ? serviceTypesMobil : serviceTypesMotor;

  useEffect(() => {
    const vehicleState = (location.state as { vehicle?: VehicleRecord } | null)
      ?.vehicle;
    if (vehicleState) {
      setForm((current) => ({
        ...current,
        motor: vehicleState.model,
        plat: vehicleState.plat,
        jenis_kendaraan: vehicleState.jenis_kendaraan || "motor",
      }));
      return;
    }
    simobsApi
      .getCustomerProfile()
      .then((profile) => {
        if (profile.vehicle_profile.model || profile.vehicle_profile.plat) {
          setForm((current) => ({
            ...current,
            motor: current.motor || profile.vehicle_profile.model,
            plat: current.plat || profile.vehicle_profile.plat,
            jenis_kendaraan: profile.vehicle_profile.jenis_kendaraan || "motor",
          }));
        }
      })
      .catch(() => undefined);
  }, []);

  const validate = () =>
    Object.values(form).every((value) => value.trim().length > 0);
  const submit = async () => {
    if (!validate()) {
      notify("Lengkapi semua field booking sebelum konfirmasi.", "error");
      return;
    }
    setSaving(true);
    try {
      const booking = await simobsApi.createCustomerBooking(form);
      setCreated(booking);
      setStep("success");
      notify("Booking berhasil dibuat dan masuk ke panel admin.", "success");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Gagal membuat booking.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Booking Servis"
        subtitle="Isi detail kendaraan, pilih slot waktu, lalu cek ringkasan sebelum dikirim ke bengkel."
      />
      {step === "success" && created ? (
        <Card className="mx-auto max-w-2xl p-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[8px] bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-text">
            Booking berhasil dibuat
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Nomor servis {shortServiceId(created.id)} telah dikirim ke riwayat
            dan dapat dilihat admin bengkel.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => navigate("/app/history")}>
              Lihat Riwayat
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/app/bookings/${created.id}`)}
            >
              Detail Servis
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <Card className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-text">
                  Jenis Kendaraan
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        jenis_kendaraan: "motor",
                        motor: "",
                        jenis_servis: "",
                      }))
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-3 text-sm font-bold transition ${form.jenis_kendaraan !== "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/40"}`}
                  >
                    <Bike className="h-4 w-4" /> Motor
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        jenis_kendaraan: "mobil",
                        motor: "",
                        jenis_servis: "",
                      }))
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-3 text-sm font-bold transition ${form.jenis_kendaraan === "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/40"}`}
                  >
                    <Car className="h-4 w-4" /> Mobil
                  </button>
                </div>
              </div>
              <FormSelect
                label={
                  form.jenis_kendaraan === "mobil"
                    ? "Model Mobil"
                    : "Model Motor"
                }
                value={form.motor}
                onChange={(event) => update("motor", event.target.value)}
                required
              >
                <option value="">
                  {form.jenis_kendaraan === "mobil"
                    ? "Pilih model mobil"
                    : "Pilih model motor"}
                </option>
                {currentModels.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </FormSelect>
              <FormInput
                label="Plat Nomor"
                value={form.plat}
                onChange={(event) =>
                  update("plat", event.target.value.toUpperCase())
                }
                placeholder="B 1234 ABC"
                required
              />
              <FormSelect
                label="Jenis Servis"
                value={form.jenis_servis}
                onChange={(event) => update("jenis_servis", event.target.value)}
                required
              >
                <option value="">Pilih servis</option>
                {currentServiceTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormInput
                label="Tanggal Booking"
                type="date"
                value={form.tanggal}
                onChange={(event) => update("tanggal", event.target.value)}
                required
              />
              <FormSelect
                label="Slot Waktu"
                value={form.waktu}
                onChange={(event) => update("waktu", event.target.value)}
                required
              >
                <option value="">Pilih waktu</option>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                ].map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </FormSelect>
              <div className="sm:col-span-2">
                <FormTextarea
                  label="Keluhan"
                  value={form.keluhan}
                  onChange={(event) => update("keluhan", event.target.value)}
                  placeholder="Contoh: mesin kasar, rem bunyi, tarikan berat..."
                  required
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setForm(initialBooking)}
                type="button"
              >
                Reset
              </Button>
              <Button onClick={submit} loading={saving} type="button">
                Konfirmasi &amp; Kirim Booking
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-text">Ringkasan Booking</h2>
            <div className="mt-4 space-y-3 text-sm">
              {Object.entries({
                "Jenis Kendaraan":
                  form.jenis_kendaraan === "mobil" ? "Mobil" : "Motor",
                Kendaraan: form.motor,
                Plat: form.plat,
                Servis: form.jenis_servis,
                Tanggal: form.tanggal,
                Waktu: form.waktu,
                Keluhan: form.keluhan,
              }).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted">{label}</span>
                  <strong className="text-right text-text">
                    {value || "-"}
                  </strong>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Periksa ringkasan di atas sebelum mengirim.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

export function CustomerHistoryPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useLoad<Booking[]>(
    () => simobsApi.getCustomerBookings(),
    [],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Riwayat Servis"
        subtitle="Semua booking milik akun Anda, diurutkan dari yang terbaru."
      />
      {!data.length ? (
        <EmptyState
          title="Belum ada riwayat"
          message="Riwayat akan muncul setelah Anda membuat booking servis."
          action={
            <Link to="/app/booking">
              <Button>Booking Servis</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/app/bookings/${booking.id}`)}
                >
                  Detail
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomerStatusPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useLoad<Booking[]>(
    () => simobsApi.getCustomerBookings(),
    [],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Status Servis"
        subtitle="Status selalu membaca data booking yang sama dengan admin workshop."
        action={
          <Button variant="secondary" onClick={reload}>
            Refresh
          </Button>
        }
      />
      {!data.length ? (
        <EmptyState
          title="Belum ada status servis"
          message="Booking aktif dan selesai akan tampil di halaman ini."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.map((booking) => (
            <Card key={booking.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">
                    {shortServiceId(booking.id)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-text">
                    {booking.jenis_servis}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {booking.motor} - {booking.plat}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-[8px] bg-surfaceSoft p-3">
                  <span className="block text-muted">Estimasi selesai</span>
                  <strong>{booking.estimasi_selesai || "Belum diisi"}</strong>
                </div>
                <div className="rounded-[8px] bg-surfaceSoft p-3">
                  <span className="block text-muted">Mekanik</span>
                  <strong>{booking.mekanik || "Belum ditentukan"}</strong>
                </div>
              </div>
              {booking.catatan_admin && (
                <p className="mt-4 rounded-[8px] border border-border p-3 text-sm leading-6 text-muted">
                  {booking.catatan_admin}
                </p>
              )}
              <div className="mt-5 flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/app/bookings/${booking.id}`)}
                >
                  Lihat Detail
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomerBookingDetailPage() {
  const { id = "" } = useParams();
  const { data, loading, error, reload } = useLoad<Booking>(
    () => simobsApi.getCustomerBooking(id),
    [id],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  const rows = [
    ["Motor", data.motor],
    ["Plat", data.plat],
    ["Jenis Servis", data.jenis_servis],
    ["Keluhan", data.keluhan],
    ["Tanggal", data.tanggal],
    ["Waktu", data.waktu],
    ["Mekanik", data.mekanik || "Belum ditentukan"],
    ["Estimasi", data.estimasi_selesai || "Belum diisi"],
  ];
  return (
    <div>
      <PageHeader
        title="Detail Servis"
        subtitle={shortServiceId(data.id)}
        action={<StatusBadge status={data.status} />}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="text-lg font-bold text-text">Informasi Servis</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[8px] border border-border bg-surfaceSoft p-3"
              >
                <span className="block text-xs uppercase tracking-wide text-muted">
                  {label}
                </span>
                <strong className="mt-1 block text-sm text-text">
                  {value}
                </strong>
              </div>
            ))}
          </div>
          {data.catatan_admin && (
            <div className="mt-4 rounded-[8px] border border-accent/30 bg-accent/10 p-4 text-sm leading-6 text-text">
              <strong>Catatan admin: </strong>
              {data.catatan_admin}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-bold text-text">Progress Servis</h2>
          <Timeline status={data.status} />
        </Card>
      </div>
    </div>
  );
}

export function CustomerNotificationsPage() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const { data, loading, error, reload } = useLoad<NotificationRecord[]>(
    () => simobsApi.getCustomerNotifications(),
    [],
  );
  const openNotification = async (item: NotificationRecord) => {
    await simobsApi.markNotificationRead(item.id);
    notify("Notifikasi ditandai sudah dibaca.", "success");
    if (item.booking_id) navigate(`/app/bookings/${item.booking_id}`);
    else navigate("/app/status");
  };
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Notifikasi"
        subtitle="Informasi booking dan perubahan status servis dari bengkel."
      />
      {!data.length ? (
        <EmptyState
          icon={Bell}
          title="Belum ada notifikasi"
          message="Notifikasi booking dan status servis akan muncul di sini."
        />
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => openNotification(item)}
              className="app-card block w-full p-4 text-left transition hover:bg-surfaceSoft"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${item.dibaca ? "bg-border" : "bg-accent"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-text">{item.judul}</h3>
                    <Badge tone={item.dibaca ? "default" : "accent"}>
                      {item.dibaca ? "Dibaca" : "Baru"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {item.pesan}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomerProfilePage() {
  const { notify, refreshSession } = useSimobs();
  const { data, loading, error, reload } = useLoad<SimobsUser>(
    () => simobsApi.getCustomerProfile(),
    [],
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SimobsUser | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  const updateRoot = (key: "nama" | "email" | "no_hp", value: string) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));
  const updateVehicle = (key: keyof VehicleProfile, value: string) =>
    setForm((current) =>
      current
        ? {
            ...current,
            vehicle_profile: { ...current.vehicle_profile, [key]: value },
          }
        : current,
    );
  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await simobsApi.updateCustomerProfile({
        nama: form.nama,
        email: form.email,
        no_hp: form.no_hp,
        vehicle_profile: form.vehicle_profile,
      });
      await refreshSession();
      notify("Profil berhasil disimpan.", "success");
      setEditing(false);
      reload();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menyimpan profil.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader
        title="Profil Pelanggan"
        subtitle="Kelola data akun dan kendaraan yang digunakan saat booking."
        action={
          <Button
            variant={editing ? "primary" : "secondary"}
            onClick={() => (editing ? save() : setEditing(true))}
            loading={saving}
          >
            {editing ? (
              <Save className="h-4 w-4" />
            ) : (
              <Edit3 className="h-4 w-4" />
            )}
            {editing ? "Simpan" : "Edit Profil"}
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-[8px] bg-primary text-2xl font-extrabold text-primary-foreground">
              {form.nama.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-text">{form.nama}</h2>
              <p className="text-sm text-muted">{form.email}</p>
              <p className="text-sm text-muted">
                {form.no_hp || "Nomor HP belum diisi"}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <FormInput
              label="Nama lengkap"
              value={form.nama}
              onChange={(event) => updateRoot("nama", event.target.value)}
              disabled={!editing}
            />
            <FormInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateRoot("email", event.target.value)}
              disabled={!editing}
            />
            <FormInput
              label="Nomor HP"
              value={form.no_hp}
              onChange={(event) => updateRoot("no_hp", event.target.value)}
              disabled={!editing}
            />
          </div>
          {editing && (
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => {
                setForm(data);
                setEditing(false);
              }}
            >
              Batal Edit
            </Button>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-text">Informasi Kendaraan</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-text">
                Jenis Kendaraan
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!editing}
                  onClick={() =>
                    editing && updateVehicle("jenis_kendaraan", "motor")
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-3 text-sm font-bold transition ${form.vehicle_profile.jenis_kendaraan !== "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"} ${!editing ? "cursor-not-allowed opacity-60" : "hover:border-primary/40"}`}
                >
                  <Bike className="h-4 w-4" /> Motor
                </button>
                <button
                  type="button"
                  disabled={!editing}
                  onClick={() =>
                    editing && updateVehicle("jenis_kendaraan", "mobil")
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-3 text-sm font-bold transition ${form.vehicle_profile.jenis_kendaraan === "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted"} ${!editing ? "cursor-not-allowed opacity-60" : "hover:border-primary/40"}`}
                >
                  <Car className="h-4 w-4" /> Mobil
                </button>
              </div>
            </div>
            <FormSelect
              label={
                form.vehicle_profile.jenis_kendaraan === "mobil"
                  ? "Model Mobil"
                  : "Model Motor"
              }
              value={form.vehicle_profile.model}
              onChange={(event) => updateVehicle("model", event.target.value)}
              disabled={!editing}
            >
              <option value="">Pilih model</option>
              {(form.vehicle_profile.jenis_kendaraan === "mobil"
                ? mobilModels
                : vehicleModels
              ).map((model) => (
                <option key={model}>{model}</option>
              ))}
            </FormSelect>
            <FormInput
              label="Tahun"
              value={form.vehicle_profile.tahun}
              onChange={(event) => updateVehicle("tahun", event.target.value)}
              disabled={!editing}
            />
            <FormInput
              label="Plat nomor"
              value={form.vehicle_profile.plat}
              onChange={(event) =>
                updateVehicle("plat", event.target.value.toUpperCase())
              }
              disabled={!editing}
            />
            <FormInput
              label="Warna"
              value={form.vehicle_profile.warna}
              onChange={(event) => updateVehicle("warna", event.target.value)}
              disabled={!editing}
            />
            <div className="sm:col-span-2">
              <FormInput
                label="Terakhir servis"
                type="date"
                value={form.vehicle_profile.terakhir_servis}
                onChange={(event) =>
                  updateVehicle("terakhir_servis", event.target.value)
                }
                disabled={!editing}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              className="rounded-[8px] border border-border bg-surfaceSoft p-4 text-sm font-semibold text-text"
              href="tel:+628123456789"
            >
              <Phone className="mb-2 h-5 w-5 text-accent" />
              Telepon
            </a>
            <a
              className="rounded-[8px] border border-border bg-surfaceSoft p-4 text-sm font-semibold text-text"
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mb-2 h-5 w-5 text-success" />
              WhatsApp
            </a>
            <a
              className="rounded-[8px] border border-border bg-surfaceSoft p-4 text-sm font-semibold text-text"
              href="mailto:simobs@bengkel.id"
            >
              <Mail className="mb-2 h-5 w-5 text-info" />
              Email
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function CustomerSettingsPage() {
  const { themePreference, setThemePreference, notify, logout } = useSimobs();
  const navigate = useNavigate();
  const [modal, setModal] = useState<
    "feedback" | "cache" | "privacy" | "terms" | "password" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const doChangePassword = async () => {
    setPwSaving(true);
    try {
      await simobsApi.changePassword(
        pwForm.current,
        pwForm.newPw,
        pwForm.confirm,
      );
      notify("Password berhasil diubah.", "success");
      setModal(null);
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal mengubah password.",
        "error",
      );
    } finally {
      setPwSaving(false);
    }
  };
  const sendFeedback = () => {
    setModal(null);
    setFeedback("");
    notify(
      "Terima kasih. Umpan balik tersimpan secara lokal untuk demo.",
      "success",
    );
  };
  const clearCache = () => {
    simobsApi.clearLocalCachePreserveData();
    setModal(null);
    notify("Cache UI berhasil dibersihkan. Data akun tetap aman.", "success");
  };
  const doLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  const rows = [
    {
      title: "Ganti Password",
      desc: "Ubah password akun Anda.",
      action: () => setModal("password"),
    },
    {
      title: "Feedback",
      desc: "Beri masukan untuk layanan bengkel.",
      action: () => setModal("feedback"),
    },
    {
      title: "Clear cache",
      desc: "Hapus cache UI tanpa menghapus data akun.",
      action: () => setModal("cache"),
    },
    {
      title: "Privacy policy",
      desc: "Informasi penggunaan data pelanggan.",
      action: () => setModal("privacy"),
    },
    {
      title: "Terms and conditions",
      desc: "Ketentuan booking dan layanan bengkel.",
      action: () => setModal("terms"),
    },
  ];
  return (
    <div>
      <PageHeader
        title="Pengaturan"
        subtitle="Atur preferensi tema, privasi, feedback, cache, dan logout."
      />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <h2 className="text-lg font-bold text-text">General</h2>
          <div className="mt-4">
            <FormSelect
              label="Tema aplikasi"
              value={themePreference}
              onChange={(event) =>
                setThemePreference(event.target.value as ThemePreference)
              }
              hint="Auto mengikuti waktu lokal: pagi, siang, sore, malam."
            >
              <option value="auto">Auto berdasarkan waktu</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </FormSelect>
          </div>
          <Button className="mt-5 w-full" variant="danger" onClick={doLogout}>
            Logout
          </Button>
        </Card>
        <div className="space-y-3">
          {rows.map((row) => (
            <button
              key={row.title}
              onClick={row.action}
              className="app-card block w-full p-5 text-left transition hover:bg-surfaceSoft"
            >
              <h3 className="font-bold text-text">{row.title}</h3>
              <p className="mt-1 text-sm text-muted">{row.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <Modal
        open={modal === "password"}
        title="Ganti Password"
        onClose={() => setModal(null)}
      >
        <div className="space-y-4">
          <FormInput
            label="Password Saat Ini"
            type="password"
            value={pwForm.current}
            onChange={(e) =>
              setPwForm((f) => ({ ...f, current: e.target.value }))
            }
          />
          <FormInput
            label="Password Baru"
            type="password"
            value={pwForm.newPw}
            onChange={(e) =>
              setPwForm((f) => ({ ...f, newPw: e.target.value }))
            }
            hint="Minimal 8 karakter."
          />
          <FormInput
            label="Konfirmasi Password Baru"
            type="password"
            value={pwForm.confirm}
            onChange={(e) =>
              setPwForm((f) => ({ ...f, confirm: e.target.value }))
            }
          />
          <div className="flex justify-end gap-
              
              
              
            
              
            
        <FormTextarea
          label="Masukan"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={sendFeedback}>Kirim</Button>
        </div>
      </Modal>
      <Modal
        open={modal === "cache"}
        title="Bersihkan Cache"
        onClose={() => setModal(null)}
      >
        <p className="text-sm leading-6 text-muted">
          Ini hanya menghapus cache UI. Data akun, booking, dan sparepart tidak
          dihapus.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModal(null)}>
            Batal
          </Button>
          <Button variant="danger" onClick={clearCache}>
            Hapus Cache
          </Button>
        </div>
      </Modal>
      <Modal
        open={modal === "privacy"}
        title="Privacy Policy"
        onClose={() => setModal(null)}
      >
        <p className="text-sm leading-6 text-muted">
          Data pelanggan dipakai untuk booking servis, notifikasi status, dan
          pengelolaan workshop. Secret key dan service account Firebase harus
          disimpan melalui environment variable, bukan di source code.
        </p>
      </Modal>
      <Modal
        open={modal === "terms"}
        title="Syarat & Ketentuan"
        onClose={() => setModal(null)}
      >
        <p className="text-sm leading-6 text-muted">
          Booking mengikuti slot bengkel. Pembayaran dilakukan langsung di
          bengkel setelah servis selesai atau sesuai kebijakan workshop.
        </p>
      </Modal>
    </div>
  );
}

export function CustomerSparepartsPage() {
  const { data, loading, error, reload } = useLoad<ProductCategory[]>(
    () => simobsApi.getSparepartCatalog(),
    [],
  );
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      (data ?? []).filter((category) =>
        `${category.name} ${category.description} ${category.products.map((p) => p.name).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data, query],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Spare Parts"
        subtitle="Katalog sparepart bengkel dengan informasi harga dan interval penggantian."
      />
      <div className="mb-5 max-w-xl">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Cari kategori atau produk..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((category) => (
          <Link key={category.slug} to={`/app/spareparts/${category.slug}`}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-premium">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-accent/12 text-accent">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text">
                {category.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {category.description}
              </p>
              <Badge className="mt-4" tone="accent">
                {category.products.length} produk
              </Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

const emptyVehicleForm: Omit<VehicleRecord, "id"> = {
  jenis_kendaraan: "motor",
  model: "",
  tahun: "",
  plat: "",
  warna: "",
  terakhir_servis: "",
};

export function CustomerGarasiPage() {
  const { notify } = useSimobs();
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<VehicleRecord, "id">>(emptyVehicleForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    try {
      setVehicles(simobsApi.getCustomerVehicles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openAdd = () => {
    setForm(emptyVehicleForm);
    setShowModal(true);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.model || !form.plat || !form.tahun || !form.warna) {
      notify("Lengkapi semua data kendaraan.", "error");
      return;
    }
    setSaving(true);
    try {
      simobsApi.addCustomerVehicle(form);
      notify("Kendaraan berhasil ditambahkan.", "success");
      setShowModal(false);
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menambahkan kendaraan.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    try {
      simobsApi.deleteCustomerVehicle(id);
      notify("Kendaraan dihapus.", "success");
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menghapus kendaraan.",
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const currentModels =
    form.jenis_kendaraan === "mobil" ? mobilModels : vehicleModels;

  return (
    <div>
      <PageHeader
        title="Garasi Saya"
        subtitle="Kelola daftar kendaraan yang kamu miliki."
        action={
          <Button variant="primary" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Tambah Kendaraan
          </Button>
        }
      />
      {loading ? (
        <LoadingSpinner />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="Belum ada kendaraan"
          message="Tambahkan kendaraanmu agar lebih mudah saat booking servis."
          action={
            <Button variant="primary" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Tambah Kendaraan
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v) => (
            <Card key={v.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-accent/15 text-accent">
                  {v.jenis_kendaraan === "mobil" ? (
                    <Car className="h-5 w-5" />
                  ) : (
                    <Bike className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-text">{v.model}</p>
                  <p className="text-xs text-muted">{v.plat}</p>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  type="button"
                  loading={deletingId === v.id}
                  onClick={() => handleDelete(v.id)}
                  aria-label="Hapus kendaraan"
                >
                  <span className="text-xs">✕</span>
                </Button>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Tahun</span>
                  <strong className="text-text">{v.tahun}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Warna</span>
                  <strong className="text-text">{v.warna}</strong>
                </div>
                {v.terakhir_servis && (
                  <div className="flex justify-between">
                    <span className="text-muted">Servis terakhir</span>
                    <strong className="text-text">{v.terakhir_servis}</strong>
                  </div>
                )}
              </div>
              <Link
                to="/app/booking"
                state={{ vehicle: v }}
                className="block mt-1"
              >
                <Button variant="secondary" size="sm" className="w-full">
                  <CalendarClock className="h-4 w-4" /> Booking Servis
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        title="Tambah Kendaraan"
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <FormSelect
            label="Jenis Kendaraan"
            value={form.jenis_kendaraan}
            onChange={(e) => update("jenis_kendaraan", e.target.value)}
          >
            <option value="motor">Motor</option>
            <option value="mobil">Mobil</option>
          </FormSelect>
          <FormSelect
            label="Model"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          >
            <option value="">Pilih model...</option>
            {currentModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FormSelect>
          <FormInput
            label="Plat Nomor"
            value={form.plat}
            onChange={(e) => update("plat", e.target.value)}
            placeholder="Contoh: B 1234 ABC"
          />
          <FormInput
            label="Tahun"
            value={form.tahun}
            onChange={(e) => update("tahun", e.target.value)}
            placeholder="Contoh: 2020"
          />
          <FormInput
            label="Warna"
            value={form.warna}
            onChange={(e) => update("warna", e.target.value)}
            placeholder="Contoh: Hitam"
          />
          <FormInput
            label="Terakhir Servis (opsional)"
            value={form.terakhir_servis}
            onChange={(e) => update("terakhir_servis", e.target.value)}
            placeholder="Contoh: Januari 2024"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function CustomerSparepartCategoryPage() {
  const { slug = "" } = useParams();
  const { data, loading, error, reload } = useLoad<ProductCategory>(
    () => simobsApi.getSparepartCategory(slug),
    [slug],
  );
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      (data?.products ?? []).filter((product) =>
        `${product.name} ${product.description} ${product.suitableFor}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data, query],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title={data.name}
        subtitle={data.description}
        action={
          <Link to="/app/spareparts">
            <Button variant="secondary">Kembali</Button>
          </Link>
        }
      />
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_360px]">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Cari produk..."
        />
        <Card className="p-4">
          <h3 className="mb-3 font-bold text-text">Info Penggantian</h3>
          <div className="space-y-2 text-sm">
            {data.replacementInfo.map((item) => (
              <div key={item.label} className="flex justify-between gap-3">
                <span className="text-muted">{item.label}</span>
                <strong className="text-right text-text">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
