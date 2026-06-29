import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bike,
  Car,
  ClipboardList,
  Package,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import {
  mobilModels,
  serviceTypesMobil,
  serviceTypesMotor,
  sparepartCategories,
  vehicleModels,
} from "../data/catalog";
import { useSimobs } from "../context/SimobsContext";
import {
  formatRupiah,
  shortServiceId,
  simobsApi,
} from "../services/simobsService";
import type {
  AdminDashboardPayload,
  Booking,
  Pelanggan,
  Sparepart,
  VehicleType,
} from "../types";
import {
  Badge,
  Button,
  Card,
  ConfirmModal,
  EmptyState,
  FormInput,
  FormSelect,
  FormTextarea,
  LoadingSpinner,
  Modal,
  PageHeader,
  SearchInput,
  StatCard,
  StatusBadge,
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

function MobileRecord({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-4 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-text">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {meta}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
}

export function AdminDashboardPage() {
  const { data, loading, error, reload } = useLoad<AdminDashboardPayload>(
    () => simobsApi.adminDashboard(),
    [],
  );
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Ringkasan operasional bengkel, stok kritis, dan booking terbaru."
        action={
          <Button variant="secondary" onClick={reload}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pelanggan"
          value={data.totalPelanggan}
          icon={Users}
          tone="info"
        />
        <StatCard
          title="Total Booking"
          value={data.totalBooking}
          icon={ClipboardList}
          tone="accent"
        />
        <StatCard
          title="Total Sparepart"
          value={data.totalSparepart}
          icon={Package}
          tone="success"
        />
        <StatCard
          title="Total Admin"
          value={data.totalAdmin}
          icon={ShieldCheck}
          tone="warning"
        />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-bold text-text">Low Stock Sparepart</h2>
          </div>
          {!data.lowStock.length ? (
            <p className="text-sm text-muted">Tidak ada stok di bawah 5.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[8px] border border-warning/30 bg-warning/10 p-3"
                >
                  <div>
                    <div className="font-bold text-text">
                      {item.nama_sparepart}
                    </div>
                    <div className="text-sm text-muted">{item.kategori}</div>
                  </div>
                  <Badge tone="warning">Stok {item.stok}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Wrench className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-text">Recent Bookings</h2>
          </div>
          {!data.recentBookings.length ? (
            <p className="text-sm text-muted">Belum ada booking.</p>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[8px] border border-border bg-surfaceSoft p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-text">
                      {booking.nama_pelanggan}
                    </strong>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {booking.motor} - {booking.keluhan}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const emptyCustomer = { nama: "", alamat: "", telepon: "" };

export function AdminCustomersPage() {
  const { notify } = useSimobs();
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: "add" | "edit";
    row?: Pelanggan;
  } | null>(null);
  const [confirm, setConfirm] = useState<Pelanggan | null>(null);
  const [form, setForm] = useState(emptyCustomer);
  const load = async (q = keyword) => {
    setLoading(true);
    setRows(await simobsApi.getPelanggan(q));
    setLoading(false);
  };
  useEffect(() => {
    load("");
  }, []);
  const openAdd = () => {
    setForm(emptyCustomer);
    setModal({ type: "add" });
  };
  const openEdit = (row: Pelanggan) => {
    setForm({ nama: row.nama, alamat: row.alamat, telepon: row.telepon });
    setModal({ type: "edit", row });
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (modal?.type === "add") await simobsApi.addPelanggan(form);
      else if (modal?.row) await simobsApi.updatePelanggan(modal.row.id, form);
      notify("Data pelanggan berhasil disimpan.", "success");
      setModal(null);
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menyimpan pelanggan.",
        "error",
      );
    }
  };
  const remove = async () => {
    if (!confirm) return;
    try {
      await simobsApi.deletePelanggan(confirm.source, confirm.id);
      notify("Pelanggan dihapus.", "success");
      setConfirm(null);
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menghapus pelanggan.",
        "error",
      );
    }
  };
  return (
    <div>
      <PageHeader
        title="Pelanggan"
        subtitle="Gabungan pelanggan registrasi dan pelanggan manual admin."
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Tambah Pelanggan
          </Button>
        }
      />
      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onClear={() => {
              setKeyword("");
              load("");
            }}
            placeholder="Cari nama, alamat, telepon..."
          />
          <Button variant="secondary" onClick={() => load(keyword)}>
            Cari
          </Button>
        </div>
      </Card>
      {loading ? (
        <LoadingSpinner />
      ) : !rows.length ? (
        <EmptyState
          title="Data pelanggan kosong"
          message="Tambahkan pelanggan manual atau minta pelanggan melakukan registrasi."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[8px] border border-border bg-surface md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surfaceSoft text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Alamat</th>
                  <th className="p-3">No. Telepon</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={`${row.source}-${row.id}`}
                    className="border-t border-border"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-bold text-text">
                      {row.nama}{" "}
                      {row.source === "user" && (
                        <Badge tone="info">Registrasi</Badge>
                      )}
                    </td>
                    <td className="p-3 text-muted">{row.alamat}</td>
                    <td className="p-3">{row.telepon}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={row.source !== "admin"}
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={row.source !== "admin"}
                          onClick={() => setConfirm(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <MobileRecord
                key={`${row.source}-${row.id}`}
                title={row.nama}
                subtitle={`${row.alamat} - ${row.telepon}`}
                meta={
                  <Badge tone={row.source === "user" ? "info" : "accent"}>
                    {row.source === "user" ? "Registrasi" : "Manual"}
                  </Badge>
                }
              >
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={row.source !== "admin"}
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={row.source !== "admin"}
                    onClick={() => setConfirm(row)}
                  >
                    Hapus
                  </Button>
                </div>
              </MobileRecord>
            ))}
          </div>
        </>
      )}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Tambah Pelanggan" : "Edit Pelanggan"}
        onClose={() => setModal(null)}
      >
        <form className="space-y-4" onSubmit={save}>
          <FormInput
            label="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            required
          />
          <FormInput
            label="Alamat"
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          />
          <FormInput
            label="No. Telepon"
            value={form.telepon}
            onChange={(e) => setForm({ ...form, telepon: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModal(null)}
            >
              Batal
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        open={!!confirm}
        title="Hapus Pelanggan?"
        message={`Pelanggan ${confirm?.nama ?? ""} akan dihapus permanen.`}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}

const emptyBooking: Partial<Booking> = {
  nama_pelanggan: "",
  motor: "",
  jenis_kendaraan: "motor" as VehicleType,
  plat: "",
  jenis_servis: "",
  tanggal: "",
  waktu: "",
  keluhan: "",
  mekanik: "",
  status: "Menunggu",
  estimasi_selesai: "",
  catatan_admin: "",
  sparepart_diganti: "",
  total_sparepart: 0,
};

export function AdminBookingsPage() {
  const { notify } = useSimobs();
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: "add" | "edit";
    row?: Booking;
  } | null>(null);
  const [confirm, setConfirm] = useState<Booking | null>(null);
  const [form, setForm] = useState<Partial<Booking>>(emptyBooking);
  const load = async (q = keyword) => {
    setLoading(true);
    setRows(await simobsApi.getAdminBookings(q));
    setLoading(false);
  };
  useEffect(() => {
    load("");
  }, []);
  const update = (key: keyof Booking, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }));
  const openAdd = () => {
    setForm(emptyBooking);
    setModal({ type: "add" });
  };
  const openEdit = (row: Booking) => {
    setForm(row);
    setModal({ type: "edit", row });
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (modal?.type === "add") await simobsApi.addAdminBooking(form);
      else if (modal?.row)
        await simobsApi.updateAdminBooking(modal.row.id, form);
      notify(
        "Booking berhasil disimpan. Jika status berubah, pelanggan mendapat notifikasi.",
        "success",
      );
      setModal(null);
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menyimpan booking.",
        "error",
      );
    }
  };
  const remove = async () => {
    if (!confirm) return;
    await simobsApi.deleteAdminBooking(confirm.id);
    notify("Booking dihapus.", "success");
    setConfirm(null);
    load();
  };
  return (
    <div>
      <PageHeader
        title="Booking"
        subtitle="Kelola semua booking, update status, mekanik, estimasi, catatan, dan sparepart."
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Tambah Booking
          </Button>
        }
      />
      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onClear={() => {
              setKeyword("");
              load("");
            }}
            placeholder="Cari pelanggan, motor, mekanik, status, keluhan..."
          />
          <Button variant="secondary" onClick={() => load(keyword)}>
            Cari
          </Button>
          <Button variant="secondary" onClick={() => load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      {loading ? (
        <LoadingSpinner />
      ) : !rows.length ? (
        <EmptyState
          title="Belum ada booking"
          message="Booking pelanggan otomatis muncul di sini setelah dibuat."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[8px] border border-border bg-surface lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surfaceSoft text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Pelanggan</th>
                  <th className="p-3">Kendaraan</th>
                  <th className="p-3">Keluhan</th>
                  <th className="p-3">Mekanik</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Estimasi Selesai</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <strong>{row.nama_pelanggan}</strong>
                      <div className="text-xs text-muted">
                        {shortServiceId(row.id)}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        tone={
                          row.jenis_kendaraan === "mobil" ? "info" : "accent"
                        }
                        className="mb-1"
                      >
                        {row.jenis_kendaraan === "mobil" ? "Mobil" : "Motor"}
                      </Badge>
                      <div>{row.motor}</div>
                    </td>
                    <td className="max-w-[240px] truncate p-3 text-muted">
                      {row.keluhan}
                    </td>
                    <td className="p-3">{row.mekanik || "-"}</td>
                    <td className="p-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="p-3">{row.estimasi_selesai || "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setConfirm(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 lg:hidden">
            {rows.map((row) => (
              <MobileRecord
                key={row.id}
                title={row.nama_pelanggan}
                subtitle={`${row.jenis_kendaraan === "mobil" ? "Mobil" : "Motor"}: ${row.motor} - ${row.keluhan}`}
                meta={<StatusBadge status={row.status} />}
              >
                <div className="mb-3 text-sm text-muted">
                  Mekanik: {row.mekanik || "-"} | Estimasi:{" "}
                  {row.estimasi_selesai || "-"}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirm(row)}
                  >
                    Hapus
                  </Button>
                </div>
              </MobileRecord>
            ))}
          </div>
        </>
      )}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Tambah Booking" : "Edit Booking"}
        onClose={() => setModal(null)}
        width="max-w-3xl"
      >
        <form className="space-y-4" onSubmit={save}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Nama Pelanggan"
              value={form.nama_pelanggan ?? ""}
              onChange={(e) => update("nama_pelanggan", e.target.value)}
              required
            />
            <div>
              <span className="mb-2 block text-sm font-semibold text-text">
                Jenis Kendaraan
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    update("jenis_kendaraan", "motor");
                    update("motor", "");
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-2.5 text-sm font-bold transition ${form.jenis_kendaraan !== "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/40"}`}
                >
                  <Bike className="h-4 w-4" /> Motor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    update("jenis_kendaraan", "mobil");
                    update("motor", "");
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] border-2 py-2.5 text-sm font-bold transition ${form.jenis_kendaraan === "mobil" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/40"}`}
                >
                  <Car className="h-4 w-4" /> Mobil
                </button>
              </div>
            </div>
            <FormSelect
              label={
                form.jenis_kendaraan === "mobil" ? "Model Mobil" : "Model Motor"
              }
              value={form.motor ?? ""}
              onChange={(e) => update("motor", e.target.value)}
              required
            >
              <option value="">
                {form.jenis_kendaraan === "mobil"
                  ? "Pilih model mobil"
                  : "Pilih model motor"}
              </option>
              {(form.jenis_kendaraan === "mobil"
                ? mobilModels
                : vehicleModels
              ).map((model) => (
                <option key={model}>{model}</option>
              ))}
            </FormSelect>
            <FormInput
              label="Plat"
              value={form.plat ?? ""}
              onChange={(e) => update("plat", e.target.value.toUpperCase())}
            />
            <FormSelect
              label="Jenis Servis"
              value={form.jenis_servis ?? ""}
              onChange={(e) => update("jenis_servis", e.target.value)}
            >
              <option value="">Pilih servis</option>
              {(form.jenis_kendaraan === "mobil"
                ? serviceTypesMobil
                : serviceTypesMotor
              ).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormSelect>
            <FormInput
              label="Tanggal"
              type="date"
              value={form.tanggal ?? ""}
              onChange={(e) => update("tanggal", e.target.value)}
            />
            <FormInput
              label="Waktu"
              type="time"
              value={form.waktu ?? ""}
              onChange={(e) => update("waktu", e.target.value)}
            />
            <FormInput
              label="Mekanik"
              value={form.mekanik ?? ""}
              onChange={(e) => update("mekanik", e.target.value)}
            />
            <FormSelect
              label="Status"
              value={form.status ?? "Menunggu"}
              onChange={(e) => update("status", e.target.value)}
            >
              <option>Menunggu</option>
              <option>Diproses</option>
              <option>Selesai</option>
              <option>Ditunda</option>
            </FormSelect>
            <FormInput
              label="Estimasi Selesai"
              type="datetime-local"
              value={form.estimasi_selesai ?? ""}
              onChange={(e) => update("estimasi_selesai", e.target.value)}
            />
            <FormInput
              label="Total Sparepart"
              type="number"
              value={String(form.total_sparepart ?? 0)}
              onChange={(e) =>
                update("total_sparepart", Number(e.target.value))
              }
            />
          </div>
          <FormTextarea
            label="Keluhan"
            value={form.keluhan ?? ""}
            onChange={(e) => update("keluhan", e.target.value)}
            required
          />
          <FormTextarea
            label="Sparepart Diganti"
            value={form.sparepart_diganti ?? ""}
            onChange={(e) => update("sparepart_diganti", e.target.value)}
          />
          <FormTextarea
            label="Catatan Admin"
            value={form.catatan_admin ?? ""}
            onChange={(e) => update("catatan_admin", e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModal(null)}
            >
              Batal
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        open={!!confirm}
        title="Hapus Booking?"
        message={`Booking ${confirm?.nama_pelanggan ?? ""} akan dihapus permanen.`}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}

const emptyPart = { nama_sparepart: "", kategori: "Oli", stok: 0, harga: 0 };

export function AdminSparepartsPage() {
  const { notify } = useSimobs();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: "add" | "edit";
    row?: Sparepart;
  } | null>(null);
  const [confirm, setConfirm] = useState<Sparepart | null>(null);
  const [form, setForm] = useState(emptyPart);
  const load = async (q = keyword, k = category) => {
    setLoading(true);
    setRows(await simobsApi.getAdminSpareparts(q, k));
    setLoading(false);
  };
  useEffect(() => {
    load("", "");
  }, []);
  const openAdd = () => {
    setForm(emptyPart);
    setModal({ type: "add" });
  };
  const openEdit = (row: Sparepart) => {
    setForm({
      nama_sparepart: row.nama_sparepart,
      kategori: row.kategori,
      stok: row.stok,
      harga: row.harga,
    });
    setModal({ type: "edit", row });
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (modal?.type === "add") await simobsApi.addSparepart(form);
      else if (modal?.row) await simobsApi.updateSparepart(modal.row.id, form);
      notify("Sparepart berhasil disimpan.", "success");
      setModal(null);
      load();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Gagal menyimpan sparepart.",
        "error",
      );
    }
  };
  const remove = async () => {
    if (!confirm) return;
    await simobsApi.deleteSparepart(confirm.id);
    notify("Sparepart dihapus.", "success");
    setConfirm(null);
    load();
  };
  return (
    <div>
      <PageHeader
        title="Sparepart"
        subtitle="Kelola stok, kategori, harga, dan peringatan stok rendah."
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Tambah Sparepart
          </Button>
        }
      />
      <Card className="mb-5 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            onClear={() => {
              setKeyword("");
              load("", category);
            }}
            placeholder="Cari sparepart..."
          />
          <select
            className="rounded-[8px] border border-border bg-surface px-3 py-3 text-sm"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              load(keyword, e.target.value);
            }}
          >
            <option value="">Semua kategori</option>
            {sparepartCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => load(keyword, category)}>
            Cari
          </Button>
        </div>
      </Card>
      {loading ? (
        <LoadingSpinner />
      ) : !rows.length ? (
        <EmptyState
          title="Data sparepart kosong"
          message="Tambahkan sparepart agar stok bengkel dapat dipantau."
        />
      ) : (
        <div className="grid gap-3">
          {rows.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted">#{index + 1}</span>
                    <h3 className="font-bold text-text">
                      {item.nama_sparepart}
                    </h3>
                    <Badge tone="accent">{item.kategori}</Badge>
                    {item.stok < 5 && <Badge tone="warning">Stok rendah</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Stok {item.stok} - {formatRupiah(item.harga)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirm(item)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        open={!!modal}
        title={modal?.type === "add" ? "Tambah Sparepart" : "Edit Sparepart"}
        onClose={() => setModal(null)}
      >
        <form className="space-y-4" onSubmit={save}>
          <FormInput
            label="Nama Sparepart"
            value={form.nama_sparepart}
            onChange={(e) =>
              setForm({ ...form, nama_sparepart: e.target.value })
            }
            required
          />
          <FormSelect
            label="Kategori"
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          >
            {sparepartCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FormSelect>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Stok"
              type="number"
              value={String(form.stok)}
              onChange={(e) =>
                setForm({ ...form, stok: Number(e.target.value) })
              }
            />
            <FormInput
              label="Harga"
              type="number"
              value={String(form.harga)}
              onChange={(e) =>
                setForm({ ...form, harga: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModal(null)}
            >
              Batal
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" /> Simpan
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        open={!!confirm}
        title="Hapus Sparepart?"
        message={`${confirm?.nama_sparepart ?? ""} akan dihapus permanen.`}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}

export function AdminListPage() {
  const { data, loading, error, reload } = useLoad<
    Array<{ id: string; nama: string; username: string; created_at: string }>
  >(() => simobsApi.getAdmins(), []);
  const filtered = useMemo(() => data ?? [], [data]);
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <PageHeader
        title="Data Admin"
        subtitle="Daftar akun admin. Password tidak pernah ditampilkan."
      />
      {!filtered.length ? (
        <EmptyState
          icon={ShieldCheck}
          title="Belum ada admin"
          message="Daftar admin baru melalui halaman registrasi admin."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((admin, index) => (
            <Card key={admin.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-primary text-primary-foreground font-bold">
                  {admin.nama.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted">#{index + 1}</span>
                    <h3 className="font-bold text-text">{admin.nama}</h3>
                    <Badge tone="accent">Admin</Badge>
                  </div>
                  <p className="text-sm text-muted">
                    Username: {admin.username}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
