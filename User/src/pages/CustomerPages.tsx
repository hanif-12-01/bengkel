import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  Car,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSimobs } from "../context/SimobsContext";
import { useAuth } from "../context/AuthContext";
import { fetchServices } from "../services/serviceApi";
import type { ServiceData } from "../services/serviceApi";
import { fetchWorkshops } from "../services/workshopApi";
import type { WorkshopData } from "../services/workshopApi";
import {
  createBooking,
  createVehicle,
  fetchBookingById,
  fetchBookings,
} from "../services/bookingApi";
import type { BookingData, VehicleType } from "../services/bookingApi";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const labelClass = "mb-2 block text-sm font-bold text-slate-700";
const cardClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

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

const vehicleOptions: { value: VehicleType; label: string; icon: typeof Car }[] = [
  { value: "mobil", label: "Mobil", icon: Car },
  { value: "motor", label: "Motor", icon: Bike },
];

export function LandingPage() {
  const howItWorks = [
    "Pilih kendaraan",
    "Pilih bengkel dan layanan",
    "Tentukan jadwal",
    "Datang ke bengkel atau tunggu konfirmasi",
    "Pantau status servis",
  ];

  const benefits = [
    "Booking mudah",
    "Harga lebih transparan",
    "Jadwal lebih teratur",
    "Riwayat servis tersimpan",
    "Cocok untuk mobil dan motor",
  ];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-14 text-white shadow-2xl md:px-12 md:py-20">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
              <Sparkles className="h-4 w-4" />
              Booking bengkel mobil dan motor
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Booking Servis Mobil & Motor Tanpa Ribet
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Pilih layanan, tentukan jadwal, dan pantau status servis kendaraanmu
              dengan mudah.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-3 font-black text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400"
              >
                Booking Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/layanan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/15"
              >
                Lihat Layanan
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="rounded-3xl bg-white p-6 text-slate-900">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                Alur Booking
              </p>
              <div className="mt-5 space-y-3">
                {howItWorks.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <p className="font-bold text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cara-kerja">
        <SectionTitle
          eyebrow="Cara kerja"
          title="Alur servis yang jelas dari awal sampai selesai"
          description="User memilih kendaraan, bengkel, layanan, jadwal, mengisi data, lalu bisa memantau status booking."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {howItWorks.map((step, index) => (
            <div key={step} className={cardClass}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-700">
                {index + 1}
              </div>
              <p className="mt-4 font-black text-slate-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="layanan-populer">
        <SectionTitle
          eyebrow="Layanan populer"
          title="Katalog layanan untuk mobil dan motor"
          description="Pilih satu atau lebih layanan sesuai kebutuhan kendaraan."
        />
        <ServiceCatalog />
      </section>

      <section>
        <SectionTitle
          eyebrow="Keunggulan"
          title="Kenapa booking servis lewat aplikasi ini?"
          description="Fondasi aplikasi dibuat sederhana, responsif, dan mulai terhubung ke backend PHP Native serta database MySQL."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <CheckCircle2 className="h-7 w-7 text-blue-600" />
              <p className="mt-4 font-black text-slate-900">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-8 text-center text-white md:p-12">
        <h2 className="text-3xl font-black md:text-4xl">Siap servis kendaraan?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Mulai booking servis mobil atau motor sekarang, pilih jadwal yang paling cocok,
          dan pantau progresnya dari halaman status booking.
        </p>
        <Link
          to="/booking"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-7 py-3 font-black text-white transition hover:bg-blue-400"
        >
          Mulai Booking Servis <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-slate-500">{description}</p>
    </div>
  );
}

function ServiceCatalog() {
  const [mobilServices, setMobilServices] = useState<ServiceData[]>([]);
  const [motorServices, setMotorServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [mobil, motor] = await Promise.all([
          fetchServices("mobil"),
          fetchServices("motor"),
        ]);

        if (!active) return;

        setMobilServices(mobil);
        setMotorServices(motor);
      } catch (error) {
        if (!active) return;

        const message =
          error instanceof Error
            ? error.message
            : "Gagal memuat katalog layanan dari server.";
        setErrorMessage(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-center font-bold text-slate-500">
        Memuat katalog layanan dari server...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 font-bold text-red-700">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {vehicleOptions.map((vehicle) => {
        const serviceList = vehicle.value === "mobil" ? mobilServices : motorServices;

        return (
          <div key={vehicle.value} className={cardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <vehicle.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-950">Layanan {vehicle.label}</h3>
            </div>

            {serviceList.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                Belum ada layanan aktif untuk {vehicle.label}.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceList.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-black text-slate-900">{service.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                        {formatPriceRange(service.min_price, service.max_price)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {service.estimated_duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CustomerServices() {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Katalog layanan"
        title="Layanan bengkel untuk mobil dan motor"
        description="Daftar layanan diambil langsung dari backend PHP Native dan database MySQL."
      />
      <ServiceCatalog />
    </div>
  );
}

export function CustomerBooking() {
  const navigate = useNavigate();
  const { notify } = useSimobs();
  const { user } = useAuth();

  const [vehicleType, setVehicleType] = useState<VehicleType>("mobil");
  const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopData[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | "">("");
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    currentMileage: "",
    bookingDate: "",
    bookingTime: "",
    complaintNote: "",
    customerName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
  });

  // Sinkronisasi data user ketika terisi atau termuat dari auth context
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name,
        phone: prev.phone || user.phone,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    let active = true;

    const loadWorkshops = async () => {
      setLoadingWorkshops(true);

      try {
        const data = await fetchWorkshops();

        if (!active) return;

        setWorkshops(data);
        setSelectedWorkshopId((current) => current || data[0]?.id || "");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat daftar bengkel.";
        notify(message, "error");
      } finally {
        if (active) {
          setLoadingWorkshops(false);
        }
      }
    };

    loadWorkshops();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      setLoadingServices(true);
      setSelectedServiceIds([]);

      try {
        const data = await fetchServices(vehicleType);

        if (!active) return;

        setAvailableServices(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat layanan bengkel.";
        notify(message, "error");
      } finally {
        if (active) {
          setLoadingServices(false);
        }
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, [vehicleType]);

  const selectedServices = useMemo(
    () => availableServices.filter((service) => selectedServiceIds.includes(service.id)),
    [availableServices, selectedServiceIds],
  );

  const selectedWorkshop = useMemo(
    () => workshops.find((workshop) => workshop.id === Number(selectedWorkshopId)),
    [selectedWorkshopId, workshops],
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleService = (service: ServiceData) => {
    setSelectedServiceIds((current) =>
      current.includes(service.id)
        ? current.filter((id) => id !== service.id)
        : [...current, service.id],
    );
  };

  const submitBooking = async () => {
    const requiredFields = [
      form.vehicleBrand,
      form.vehicleModel,
      form.vehicleYear,
      form.plateNumber,
      form.currentMileage,
      form.bookingDate,
      form.bookingTime,
      form.customerName,
      form.phone,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      notify("Lengkapi data kendaraan, jadwal, nama, dan nomor HP terlebih dahulu.", "error");
      return;
    }

    if (!selectedWorkshopId) {
      notify("Pilih bengkel/cabang terlebih dahulu.", "error");
      return;
    }

    if (selectedServices.length === 0) {
      notify("Pilih minimal satu layanan bengkel.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const vehicle = await createVehicle({
        vehicle_type: vehicleType,
        brand: form.vehicleBrand,
        model: form.vehicleModel,
        year: Number(form.vehicleYear),
        plate_number: form.plateNumber,
        current_mileage: Number(form.currentMileage),
      });

      const booking = await createBooking({
        customer_name: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        vehicle_id: vehicle.id,
        workshop_id: Number(selectedWorkshopId),
        booking_date: form.bookingDate,
        booking_time: form.bookingTime,
        complaint_note: form.complaintNote || form.address || undefined,
        service_ids: selectedServiceIds,
      });

      notify("Booking berhasil dibuat. Status awal: Menunggu Konfirmasi.", "success");
      navigate(`/status?id=${booking.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat booking.";
      notify(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Booking servis"
          title="Isi data booking kendaraan"
          description="Lengkapi data kendaraan, pilih bengkel, pilih layanan, tentukan jadwal, lalu konfirmasi booking."
        />

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">1. Jenis kendaraan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {vehicleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVehicleType(option.value)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  vehicleType === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                }`}
              >
                <option.icon className="h-6 w-6" />
                <span className="font-black">{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">2. Data kendaraan</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Merek kendaraan" value={form.vehicleBrand} onChange={(value) => handleChange("vehicleBrand", value)} placeholder="Contoh: Toyota / Honda" />
            <Field label="Model kendaraan" value={form.vehicleModel} onChange={(value) => handleChange("vehicleModel", value)} placeholder="Contoh: Avanza / Vario 160" />
            <Field label="Tahun kendaraan" value={form.vehicleYear} onChange={(value) => handleChange("vehicleYear", value)} placeholder="Contoh: 2021" type="number" />
            <Field label="Nomor plat" value={form.plateNumber} onChange={(value) => handleChange("plateNumber", value)} placeholder="Contoh: B 1234 CD" />
            <Field label="Kilometer saat ini" value={form.currentMileage} onChange={(value) => handleChange("currentMileage", value)} placeholder="Contoh: 45000" type="number" />
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">3. Pilih bengkel/cabang</h2>

          {loadingWorkshops ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              Memuat daftar bengkel...
            </div>
          ) : workshops.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              Belum ada data bengkel aktif.
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {workshops.map((workshop) => {
                const selected = selectedWorkshopId === workshop.id;

                return (
                  <button
                    key={workshop.id}
                    type="button"
                    onClick={() => setSelectedWorkshopId(workshop.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">{workshop.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{workshop.address}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {workshop.phone} • {workshop.opening_hours}
                        </p>
                      </div>
                      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">
            4. Pilihan layanan {getVehicleTypeLabel(vehicleType)}
          </h2>

          {loadingServices ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              Memuat layanan...
            </div>
          ) : availableServices.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              Belum ada layanan aktif untuk jenis kendaraan ini.
            </div>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {availableServices.map((service) => {
                const selected = selectedServiceIds.includes(service.id);

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">{service.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                      </div>
                      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />}
                    </div>
                    <p className="mt-3 text-xs font-bold text-blue-700">
                      {formatPriceRange(service.min_price, service.max_price)} • {service.estimated_duration}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">5. Jadwal booking</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Tanggal" value={form.bookingDate} onChange={(value) => handleChange("bookingDate", value)} type="date" />
            <Field label="Jam" value={form.bookingTime} onChange={(value) => handleChange("bookingTime", value)} type="time" />
          </div>
          <label className="mt-4 block">
            <span className={labelClass}>Catatan tambahan atau keluhan kendaraan</span>
            <textarea
              value={form.complaintNote}
              onChange={(event) => handleChange("complaintNote", event.target.value)}
              className={`${inputClass} min-h-28 resize-y`}
              placeholder="Contoh: mesin kasar, AC kurang dingin, rem berbunyi..."
            />
          </label>
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">6. Data customer</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Nama" value={form.customerName} onChange={(value) => handleChange("customerName", value)} placeholder="Nama lengkap" />
            <Field label="Nomor HP/WhatsApp" value={form.phone} onChange={(value) => handleChange("phone", value)} placeholder="08xxxxxxxxxx" />
            <Field label="Email opsional" value={form.email} onChange={(value) => handleChange("email", value)} placeholder="nama@email.com" type="email" />
            <Field label="Alamat opsional" value={form.address} onChange={(value) => handleChange("address", value)} placeholder="Alamat customer" />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className={cardClass}>
          <h2 className="text-xl font-black text-slate-950">7. Konfirmasi booking</h2>
          <SummaryItem label="Nama customer" value={form.customerName || "-"} />
          <SummaryItem label="Bengkel/cabang" value={selectedWorkshop?.name || "-"} />
          <SummaryItem label="Jenis kendaraan" value={getVehicleTypeLabel(vehicleType)} />
          <SummaryItem
            label="Data kendaraan"
            value={`${form.vehicleBrand || "-"} ${form.vehicleModel || ""} (${form.vehicleYear || "-"}) • ${form.plateNumber || "-"} • ${form.currentMileage || "-"} km`}
          />
          <SummaryItem
            label="Layanan dipilih"
            value={selectedServices.length ? selectedServices.map((service) => service.name).join(", ") : "-"}
          />
          <SummaryItem
            label="Estimasi biaya"
            value={
              selectedServices.length
                ? formatPriceRange(
                    String(selectedServices.reduce((sum, service) => sum + Number(service.min_price || 0), 0)),
                    String(selectedServices.reduce((sum, service) => sum + Number(service.max_price || 0), 0)),
                  )
                : "-"
            }
          />
          <SummaryItem
            label="Tanggal dan jam"
            value={`${formatDate(form.bookingDate)} • ${form.bookingTime || "-"}`}
          />
          <SummaryItem label="Catatan keluhan" value={form.complaintNote || "-"} />
          <button
            type="button"
            onClick={submitBooking}
            disabled={submitting || loadingServices || loadingWorkshops}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Menyimpan booking..." : "Konfirmasi Booking"}
            <ClipboardCheck className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

export function BookingStatusPage() {
  const [searchParams] = useSearchParams();
  const { notify } = useSimobs();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedId = searchParams.get("id");

  useEffect(() => {
    let active = true;

    const loadBookingsFromApi = async () => {
      setLoading(true);

      try {
        const bookingList = await fetchBookings();

        if (!active) return;

        setBookings(bookingList);

        if (selectedId) {
          const detail = await fetchBookingById(selectedId);

          if (!active) return;

          setSelectedBooking(detail);
        } else {
          setSelectedBooking(bookingList[0] || null);
        }
      } catch (error) {
        if (!active) return;

        const message =
          error instanceof Error ? error.message : "Gagal mengambil data booking dari server.";
        notify(message, "error");
        setSelectedBooking(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBookingsFromApi();

    return () => {
      active = false;
    };
  }, [selectedId]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center font-bold text-slate-500">
        Memuat data status booking...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Status booking"
        title="Pantau progres booking servis"
        description="Status akan berubah ketika admin bengkel memperbarui proses booking dari dashboard."
      />

      {!selectedBooking ? (
        <div className={cardClass}>
          <p className="font-bold text-slate-600">Belum ada booking tersimpan di database.</p>
          <Link to="/booking" className="mt-4 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">
            Buat Booking
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className={cardClass}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Nomor booking</p>
                <h2 className="text-3xl font-black text-slate-950">{selectedBooking.id}</h2>
              </div>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
                {selectedBooking.status}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {[
                "Menunggu Konfirmasi",
                "Dikonfirmasi",
                "Kendaraan Diterima",
                "Sedang Dikerjakan",
                "Selesai",
              ].map((status, index, statusList) => {
                const currentIndex = statusList.indexOf(selectedBooking.status);
                const active = selectedBooking.status === "Dibatalkan" ? index === 0 : index <= currentIndex;

                return (
                  <div key={status} className="flex gap-4">
                    <div className={`mt-1 h-4 w-4 rounded-full ${active ? "bg-blue-600" : "bg-slate-200"}`} />
                    <div>
                      <p className={`font-black ${active ? "text-slate-900" : "text-slate-400"}`}>{status}</p>
                      <p className="text-sm text-slate-500">
                        {index === 0 && "Booking diterima sistem dan menunggu validasi admin."}
                        {index === 1 && "Jadwal servis sudah dikonfirmasi bengkel."}
                        {index === 2 && "Kendaraan sudah diterima oleh bengkel."}
                        {index === 3 && "Teknisi sedang mengerjakan kendaraan."}
                        {index === 4 && "Servis selesai dan kendaraan siap diambil."}
                      </p>
                    </div>
                  </div>
                );
              })}

              {selectedBooking.status === "Dibatalkan" && (
                <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-700">
                  Booking ini dibatalkan oleh admin bengkel.
                </div>
              )}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-black text-slate-950">Ringkasan booking</h3>
            <SummaryItem label="Customer" value={`${selectedBooking.customer_name} • ${selectedBooking.phone}`} />
            <SummaryItem label="Bengkel" value={selectedBooking.workshop_name || "-"} />
            <SummaryItem
              label="Kendaraan"
              value={`${getVehicleTypeLabel(selectedBooking.vehicle_type)} ${selectedBooking.vehicle_brand} ${selectedBooking.vehicle_model} (${selectedBooking.vehicle_year})`}
            />
            <SummaryItem label="Nomor plat" value={selectedBooking.plate_number} />
            <SummaryItem label="Kilometer" value={`${selectedBooking.current_mileage} km`} />
            <SummaryItem
              label="Layanan"
              value={selectedBooking.services.length ? selectedBooking.services.map((service) => service.service_name).join(", ") : "-"}
            />
            <SummaryItem
              label="Estimasi biaya"
              value={formatPriceRange(selectedBooking.estimated_min_price, selectedBooking.estimated_max_price)}
            />
            <SummaryItem label="Jadwal" value={`${formatDate(selectedBooking.booking_date)} • ${selectedBooking.booking_time}`} />
            <SummaryItem label="Keluhan" value={selectedBooking.complaint_note || "-"} />
          </div>
        </div>
      )}

      {bookings.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-xl font-black text-slate-950">Booking tersimpan di database</h3>
          <div className="mt-4 grid gap-3">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/status?id=${booking.id}`}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                  selectedBooking?.id === booking.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div>
                  <p className="font-black text-slate-900">{booking.id} • {booking.customer_name}</p>
                  <p className="text-sm text-slate-500">
                    {getVehicleTypeLabel(booking.vehicle_type)} {booking.vehicle_brand} {booking.vehicle_model}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {booking.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerTracking() {
  return <BookingStatusPage />;
}

export function CustomerHistory() {
  return <BookingStatusPage />;
}

export function CustomerDashboard() {
  return <LandingPage />;
}

export function CustomerRewards() {
  return (
    <div className={cardClass}>
      <ShieldCheck className="h-10 w-10 text-blue-600" />
      <h1 className="mt-4 text-2xl font-black text-slate-950">Fitur rewards disembunyikan dari navigasi utama</h1>
      <p className="mt-2 text-slate-500">
        Tahap fondasi memprioritaskan booking, katalog layanan, status booking, dan dashboard admin.
      </p>
      <Link to="/booking" className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">
        Booking Sekarang
      </Link>
    </div>
  );
}