import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Car,
  ClipboardList,
  Filter,
  MapPin,
  Phone,
  User,
  Wrench,
} from "lucide-react";
import { useSimobs } from "../context/SimobsContext";
import { fetchBookings, updateBookingStatus } from "../services/bookingApi";
import type { BookingData, BookingStatus } from "../services/bookingApi";

const cardClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

const bookingStatuses: BookingStatus[] = [
  "Menunggu Konfirmasi",
  "Dikonfirmasi",
  "Kendaraan Diterima",
  "Sedang Dikerjakan",
  "Selesai",
  "Dibatalkan",
];

const formatDate = (value: string) => {
  if (!value) return "-";
  const dateOnly = value.includes("T") ? value.split("T")[0] : value;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateOnly}T00:00:00`));
};

const formatRupiah = (value: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatPriceRange = (minPrice: string, maxPrice: string) => {
  const min = Number(minPrice) || 0;
  const max = Number(maxPrice) || 0;

  if (max > min) {
    return `${formatRupiah(min)} - ${formatRupiah(max)}`;
  }

  return `Mulai ${formatRupiah(min)}`;
};

function getVehicleTypeLabel(vehicleType: string) {
  return vehicleType === "mobil" || vehicleType === "car" ? "Mobil" : "Motor";
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof CalendarCheck;
}) {
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { notify } = useSimobs();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "Semua">("Semua");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const data = await fetchBookings();

        if (!active) return;

        setBookings(data);
        setSelectedBookingId((current) => current || data[0]?.id || "");
      } catch (error) {
        if (!active) return;

        const message =
          error instanceof Error ? error.message : "Gagal memuat data booking dari server.";
        notify(message, "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [notify]);

  const filteredBookings = useMemo(
    () =>
      statusFilter === "Semua"
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter),
    [bookings, statusFilter],
  );

  const selectedBooking = useMemo(() => {
    const found = bookings.find((booking) => booking.id === selectedBookingId);
    return found || filteredBookings[0] || null;
  }, [bookings, filteredBookings, selectedBookingId]);

  const handleStatusChange = async (booking: BookingData, status: BookingStatus) => {
    if (booking.status === status || updating) return;

    setUpdating(true);

    try {
      const updatedBooking = await updateBookingStatus(booking.id, status);

      setBookings((current) =>
        current.map((item) => (item.id === updatedBooking.id ? updatedBooking : item)),
      );
      setSelectedBookingId(updatedBooking.id);

      notify(`Status booking ${updatedBooking.id} berhasil diubah menjadi ${status}.`, "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui status booking.";
      notify(message, "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Admin bengkel
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
            Dashboard Booking Servis
          </h1>
          <p className="mt-3 max-w-3xl text-slate-500">
            Data booking diambil langsung dari backend PHP Native dan database MySQL.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center font-bold text-slate-500 shadow-sm">
          Memuat data booking dari server...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
          Admin bengkel
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
          Dashboard Booking Servis
        </h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Lihat semua booking dari database, filter berdasarkan status, periksa detail
          customer dan kendaraan, lalu ubah status pengerjaan melalui REST API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Booking" value={bookings.length} icon={ClipboardList} />
        <StatCard
          label="Menunggu"
          value={bookings.filter((booking) => booking.status === "Menunggu Konfirmasi").length}
          icon={CalendarCheck}
        />
        <StatCard
          label="Dikerjakan"
          value={bookings.filter((booking) => booking.status === "Sedang Dikerjakan").length}
          icon={Wrench}
        />
        <StatCard
          label="Selesai"
          value={bookings.filter((booking) => booking.status === "Selesai").length}
          icon={Car}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className={cardClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Daftar booking</h2>
              <p className="text-sm text-slate-500">Klik booking untuk melihat detail.</p>
            </div>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as BookingStatus | "Semua")}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none"
              >
                <option value="Semua">Semua status</option>
                {bookingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                Tidak ada booking dengan status ini.
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => setSelectedBookingId(booking.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedBooking?.id === booking.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">
                        {booking.id} • {booking.customer_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {getVehicleTypeLabel(booking.vehicle_type)} {booking.vehicle_brand}{" "}
                        {booking.vehicle_model} • {formatDate(booking.booking_date)}{" "}
                        {booking.booking_time}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                      {booking.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className={cardClass}>
          {!selectedBooking ? (
            <p className="font-bold text-slate-500">Belum ada booking tersimpan di database.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">Detail booking</p>
                  <h2 className="text-2xl font-black text-slate-950">{selectedBooking.id}</h2>
                </div>
                <StatusBadge status={selectedBooking.status} />
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-slate-700">Ubah status booking</p>
                <div className="flex flex-wrap gap-2">
                  {bookingStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedBooking, status)}
                      className={`rounded-full px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        selectedBooking.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <DetailSection icon={User} title="Data customer">
                <DetailItem label="Nama" value={selectedBooking.customer_name} />
                <DetailItem label="No. HP/WhatsApp" value={selectedBooking.phone} />
                <DetailItem label="Email" value={selectedBooking.email || "-"} />
              </DetailSection>

              <DetailSection icon={MapPin} title="Bengkel/cabang">
                <DetailItem label="Nama cabang" value={selectedBooking.workshop_name || "-"} />
                <DetailItem label="Alamat" value={selectedBooking.workshop_address || "-"} />
              </DetailSection>

              <DetailSection icon={Car} title="Data kendaraan">
                <DetailItem label="Jenis" value={getVehicleTypeLabel(selectedBooking.vehicle_type)} />
                <DetailItem
                  label="Kendaraan"
                  value={`${selectedBooking.vehicle_brand} ${selectedBooking.vehicle_model} (${selectedBooking.vehicle_year})`}
                />
                <DetailItem label="Nomor plat" value={selectedBooking.plate_number} />
                <DetailItem label="Kilometer" value={`${selectedBooking.current_mileage} km`} />
              </DetailSection>

              <DetailSection icon={Wrench} title="Layanan dipilih">
                <div className="grid gap-2">
                  {selectedBooking.services.length === 0 ? (
                    <p className="text-sm font-bold text-slate-500">
                      Tidak ada layanan terhubung ke booking ini.
                    </p>
                  ) : (
                    selectedBooking.services.map((service) => (
                      <div key={service.id} className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-black text-slate-900">{service.service_name}</p>
                        <p className="text-sm text-slate-500">
                          {formatPriceRange(service.min_price, service.max_price)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </DetailSection>

              <DetailSection icon={CalendarCheck} title="Jadwal booking">
                <DetailItem
                  label="Tanggal dan jam"
                  value={`${formatDate(selectedBooking.booking_date)} • ${selectedBooking.booking_time}`}
                />
                <DetailItem label="Keluhan/catatan" value={selectedBooking.complaint_note || "-"} />
                <DetailItem
                  label="Estimasi total"
                  value={formatPriceRange(
                    selectedBooking.estimated_min_price,
                    selectedBooking.estimated_max_price,
                  )}
                />
              </DetailSection>

              <div className="rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-800">
                Status dan data booking tersambung langsung dengan backend PHP Native dan database MySQL.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
      {status}
    </span>
  );
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Phone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-slate-100 py-3 first:border-t-0 sm:grid-cols-[150px_1fr]">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

export function AdminOrders() {
  return <AdminDashboard />;
}

export function AdminServices() {
  return <AdminDashboard />;
}

export function AdminInventory() {
  return <AdminDashboard />;
}

export function AdminStaff() {
  return <AdminDashboard />;
}

export function AdminReports() {
  return <AdminDashboard />;
}