export type Role = "customer" | "admin";
export type BookingStatus =
  | "Menunggu Konfirmasi"
  | "Dikonfirmasi"
  | "Kendaraan Diterima"
  | "Sedang Dikerjakan"
  | "Selesai"
  | "Dibatalkan"
  | "Menunggu"
  | "Diproses"
  | "Ditunda";
export type ThemeName = "morning" | "afternoon" | "evening" | "night";
export type ThemePreference = ThemeName | "auto";
export type NotificationType =
  | "booking"
  | "status"
  | "system"
  | "estimate"
  | "invoice"
  | "workorder";
export type VehicleType = "car" | "motorcycle" | "motor" | "mobil";

export type ServiceRequestStatus =
  | "Waiting for Admin Review"
  | "Need More Information"
  | "Inspection Scheduled"
  | "Estimate Created"
  | "Waiting for Customer Approval"
  | "Approved"
  | "In Progress"
  | "Waiting for Parts"
  | "Completed"
  | "Cancelled";

export type UrgencyLevel = "Normal" | "Needs quick checking" | "Emergency";

export type PromptTemplateType =
  | "AI Diagnostic Prompt"
  | "Customer Follow-up Question Prompt"
  | "Estimate Explanation Prompt"
  | "Mechanic Work Instruction Prompt"
  | "Service Status Update Message"
  | "WhatsApp/Email Message Template"
  | "Invoice Note Template"
  | "Service Reminder Template";

export type DiagnosticInputType =
  | "Text"
  | "Textarea"
  | "Radio"
  | "Checkbox"
  | "Dropdown"
  | "Number"
  | "Date"
  | "Photo upload";

export type EstimateStatus =
  | "Draft"
  | "Sent to Customer"
  | "Approved by Customer"
  | "Rejected by Customer"
  | "Expired";

export type WorkOrderStatus =
  | "Waiting"
  | "Assigned"
  | "In Progress"
  | "Waiting for Parts"
  | "Completed"
  | "Cancelled";

export type InvoiceStatus =
  | "Draft"
  | "Issued"
  | "Paid"
  | "Overdue"
  | "Cancelled";

export type PaymentStatus =
  | "Unpaid"
  | "Waiting Verification"
  | "Verified"
  | "Rejected";

export interface ServiceItem {
  id: string;
  name: string;
  category: Extract<VehicleType, "car" | "motorcycle">;
  description: string;
  estimatedPrice: string;
  duration: string;
}

export interface VehicleProfile {
  jenis_kendaraan: VehicleType;
  model: string;
  tahun: string;
  plat: string;
  warna: string;
  terakhir_servis: string;
}

export interface VehicleRecord extends VehicleProfile {
  id: string;
  brand?: string;
  odometer?: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  password_hash: string;
  created_at: string;
  vehicle_profile: VehicleProfile;
}

export interface Admin {
  id: string;
  nama: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export type ServiceMode = "Datang ke Bengkel" | "Home Service" | "Pickup & Delivery";

export type PickupStatus =
  | "Belum Dijadwalkan"
  | "Dijadwalkan"
  | "Dalam Perjalanan Menjemput"
  | "Kendaraan Dijemput"
  | "Dibatalkan";

export type DeliveryStatus =
  | "Belum Dijadwalkan"
  | "Dijadwalkan"
  | "Dalam Perjalanan Mengantar"
  | "Kendaraan Diterima Customer"
  | "Dibatalkan";

export type MechanicWorkStatus =
  | "Menunggu Dikerjakan"
  | "Sedang Inspeksi"
  | "Menunggu Persetujuan Customer"
  | "Sedang Dikerjakan"
  | "Quality Control"
  | "Selesai";

export type InspectionItemStatus =
  | "Baik"
  | "Perlu Dicek"
  | "Perlu Diganti"
  | "Tidak Dicek";

export interface InspectionChecklistItem {
  name: string;
  status: InspectionItemStatus;
}

export type CustomerApprovalStatus =
  | "Belum Dikirim"
  | "Menunggu Persetujuan"
  | "Disetujui"
  | "Ditolak";

export interface DigitalInspection {
  inspectionId: string;
  bookingId: string;
  checklistItems: InspectionChecklistItem[];
  mechanicNotes: string;
  damagePhotos: string[];
  additionalRecommendations: string;
  additionalEstimatedMinPrice: number;
  additionalEstimatedMaxPrice: number;
  customerApprovalStatus: CustomerApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReminderStatus = "Aktif" | "Sudah Dikirim" | "Selesai" | "Dibatalkan";

export interface ServiceReminder {
  reminderId: string;
  bookingId: string;
  customerName: string;
  phone: string;
  vehicleType: Extract<VehicleType, "car" | "motorcycle">;
  vehicleBrand: string;
  vehicleModel: string;
  plateNumber: string;
  lastServiceName: string;
  lastMileage: string;
  nextMileage: string;
  nextServiceDate: string;
  reminderStatus: ReminderStatus;
  notificationLog: string[];
  createdAt: string;
}

export type WarrantyStatus =
  | "Aktif"
  | "Berakhir"
  | "Klaim Diajukan"
  | "Klaim Disetujui"
  | "Klaim Ditolak";

export interface WarrantyClaim {
  complaint: string;
  photos: string[];
  claimDate: string;
  adminNotes?: string;
  status: "Klaim Diajukan" | "Klaim Disetujui" | "Klaim Ditolak";
}

export interface Warranty {
  warrantyId: string;
  bookingId: string;
  warrantyType: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyTerms: string;
  warrantyStatus: WarrantyStatus;
  claims?: WarrantyClaim[];
}

export interface Booking {
  id: string;
  invoiceNumber?: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  vehicleType: Extract<VehicleType, "car" | "motorcycle">;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  plateNumber: string;
  currentMileage: string;
  selectedServices: ServiceItem[];
  additionalServices?: ServiceItem[];
  estimatedMinPrice?: number;
  estimatedMaxPrice?: number;
  estimatedDuration?: string;
  bookingDate: string;
  bookingTime: string;
  complaintNote?: string;
  serviceMode?: ServiceMode;
  workshopLocation?: string;
  workshopId?: string;
  workshopName?: string;
  usedSpareparts?: UsedSparepart[];
  customerAddress?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupStatus?: PickupStatus;
  deliveryStatus?: DeliveryStatus;
  status: BookingStatus;
  mechanicWorkStatus?: MechanicWorkStatus;
  inspection?: DigitalInspection;
  notificationLogs?: string[];
  rating?: number;
  review?: string;
  paymentStatus?: "Belum Dibayar" | "DP" | "Lunas";
  warranty?: Warranty;
  reminder?: ServiceReminder;
  createdAt: string;
  updatedAt?: string;

  user_id?: string;
  user_email?: string;
  nama?: string;
  nama_pelanggan?: string;
  motor?: string;
  jenis_kendaraan?: VehicleType;
  plat?: string;
  jenis_servis?: string;
  tanggal?: string;
  waktu?: string;
  keluhan?: string;
  estimasi_selesai?: string;
  mekanik?: string;
  catatan_admin?: string;
  sparepart_diganti?: string;
  total_sparepart?: number;
  source?: "customer" | "admin" | "pengguna";
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_id: string;
  vehicle_brand: string;
  vehicle_model: string;
  year: string;
  license_plate: string;
  odometer: string;
  problem_category: string;
  problem_description: string;
  problem_started: string;
  dynamic_answers: Record<string, string | string[]>;
  urgency_level: UrgencyLevel;
  is_vehicle_usable: boolean;
  preferred_date: string;
  preferred_time: string;
  contact_confirmed: boolean;
  photos: string[];
  videos: string[];
  status: ServiceRequestStatus;
  admin_note: string;
  admin_message?: string;
  estimated_completion?: string;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  type: PromptTemplateType;
  description: string;
  content: string;
  variables: string[];
  is_active: boolean;
  version: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticQuestionTemplate {
  id: string;
  category: string;
  question_text: string;
  input_type: DiagnosticInputType;
  options: string[];
  is_required: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiDiagnosisResult {
  id: string;
  service_request_id: string;
  prompt_template_id: string;
  possible_causes: string[];
  recommended_inspection: string[];
  suggested_services: string[];
  suggested_spareparts: string[];
  risk_level: string;
  ai_notes: string;
  reviewed_by_admin: boolean;
  created_at: string;
}

export interface EstimateLineItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Estimate {
  id: string;
  service_request_id: string;
  customer_id: string;
  vehicle_id: string;
  service_items: EstimateLineItem[];
  sparepart_items: EstimateLineItem[];
  subtotal: number;
  labor_cost: number;
  sparepart_cost: number;
  discount: number;
  tax: number;
  grand_total: number;
  status: EstimateStatus;
  customer_note: string;
  admin_note: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  active: boolean;
  workload: number;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  service_request_id: string;
  estimate_id: string;
  mechanic_id: string;
  priority: UrgencyLevel;
  checklist: string[];
  used_spareparts: EstimateLineItem[];
  mechanic_notes: string;
  repair_photos: string[];
  status: WorkOrderStatus;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Tahap4VehicleType = Extract<VehicleType, "car" | "motorcycle">;

export type AiUrgencyLevel = "Rendah" | "Sedang" | "Tinggi" | "Darurat";
export type RecommendationPriority = "Rendah" | "Sedang" | "Tinggi";
export type MembershipStatus = "Aktif" | "Berakhir" | "Dibatalkan";
export type FleetVehicleStatus = "Aktif" | "Butuh Servis" | "Sedang Diservis" | "Tidak Aktif";
export type WorkshopStatus = "Aktif" | "Tutup Sementara" | "Tidak Aktif";
export type SparepartStockStatus = "Tersedia" | "Stok Menipis" | "Habis";
export type SparepartCategory =
  | "Oli"
  | "Filter"
  | "Rem"
  | "Aki"
  | "Ban"
  | "Busi"
  | "Rantai/Gear"
  | "CVT"
  | "Kelistrikan"
  | "AC"
  | "Radiator"
  | "Lainnya";

export interface VehicleServiceDiagnosis {
  diagnosisId: string;
  complaintText: string;
  vehicleType: Tahap4VehicleType;
  possibleCauses: string[];
  recommendedServices: ServiceItem[];
  urgencyLevel: AiUrgencyLevel;
  estimatedCheckDuration: string;
  diagnosisNote: string;
  createdAt: string;
}

export interface ServiceRecommendation {
  recommendationId: string;
  vehicleType: Tahap4VehicleType;
  plateNumber: string;
  currentMileage: string;
  serviceName: string;
  reason: string;
  priority: RecommendationPriority;
  targetMileage: number;
  createdAt: string;
}

export interface MembershipPackage {
  packageName: "Basic Care" | "Plus Care" | "Premium Care";
  description: string;
  benefits: string[];
  discountPercentage: number;
  recommendedFor: string;
}

export interface CustomerMembership {
  membershipId: string;
  customerName: string;
  phone: string;
  packageName: "Basic Care" | "Plus Care" | "Premium Care";
  benefits: string[];
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
}

export interface FleetVehicle {
  vehicleId: string;
  companyId: string;
  vehicleType: Tahap4VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  plateNumber: string;
  currentMileage: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: FleetVehicleStatus;
}

export interface FleetCompany {
  companyId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  vehicles: FleetVehicle[];
  createdAt: string;
}

export interface SparepartInventoryItem {
  sparepartId: string;
  name: string;
  category: SparepartCategory;
  compatibleVehicleType: Tahap4VehicleType | "both";
  stock: number;
  minimumStock: number;
  unitPrice: number;
  supplier: string;
  status: SparepartStockStatus;
  relatedServiceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UsedSparepart {
  sparepartId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface WorkshopBranch {
  workshopId: string;
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  availableServices: string[];
  mechanics: string[];
  rating: number;
  status: WorkshopStatus;
}

export interface AnalyticsSummary {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  estimatedRevenue: number;
  mostPopularService: string;
  mostUsedVehicleType: string;
  topWorkshop: string;
  averageRating: number;
  warrantyClaims: number;
  activeReminders: number;
  lowStockSpareparts: number;
  bookingsByStatus: Array<{ label: string; value: number }>;
  bookingsByVehicleType: Array<{ label: string; value: number }>;
  popularServices: Array<{ label: string; value: number }>;
  monthlyRevenue: Array<{ label: string; value: number }>;
}

export interface Invoice {
  id: string;
  estimate_id: string;
  service_request_id: string;
  customer_id: string;
  amount: number;
  status: InvoiceStatus;
  payment_status: PaymentStatus;
  note: string;
  issued_at: string;
  paid_at?: string;
  verified_at?: string;
  payment_proof?: string;
}

export interface Pelanggan {
  id: string;
  source: "user" | "admin";
  nama: string;
  alamat: string;
  telepon: string;
  created_at: string;
}

export interface Sparepart {
  id: string;
  nama_sparepart: string;
  kategori: string;
  stok: number;
  harga: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id?: string;
  user_email: string;
  customer_id?: string;
  title?: string;
  message?: string;
  type?: NotificationType;
  related_id?: string;
  read?: boolean;
  judul: string;
  pesan: string;
  tipe: NotificationType;
  booking_id?: string;
  dibaca: boolean;
  created_at: string;
}

export interface Promo {
  id: string;
  judul: string;
  nama: string;
  deskripsi: string;
  diskon?: number;
  active: boolean;
}

export interface Session {
  role: Role;
  id: string;
  nama: string;
  email?: string;
  username?: string;
  verified_at: string;
}

export interface PendingOtp {
  id: string;
  user_id: string;
  user_email: string;
  code_hash: string;
  salt: string;
  expires_at: string;
  attempts: number;
  created_at: string;
}

export interface SimobsDatabase {
  users: User[];
  admins: Admin[];
  bookings: Booking[];
  pelanggan: Pelanggan[];
  sparepart: Sparepart[];
  notifikasi: NotificationRecord[];
  promo: Promo[];
  pending_otps: PendingOtp[];
  service_requests: ServiceRequest[];
  prompt_templates: PromptTemplate[];
  diagnostic_question_templates: DiagnosticQuestionTemplate[];
  ai_diagnosis_results: AiDiagnosisResult[];
  estimates: Estimate[];
  work_orders: WorkOrder[];
  mechanics: Mechanic[];
  invoices: Invoice[];
  vehicle_service_diagnoses?: VehicleServiceDiagnosis[];
  service_recommendations?: ServiceRecommendation[];
  customer_memberships?: CustomerMembership[];
  fleet_companies?: FleetCompany[];
  sparepart_inventory?: SparepartInventoryItem[];
  workshop_branches?: WorkshopBranch[];
}

export interface DashboardPayload {
  nama: string;
  lastBooking: Booking | null;
  promos: Promo[];
  unreadNotifications: number;
  activeRequest?: ServiceRequest | null;
  pendingEstimate?: Estimate | null;
}

export interface AdminDashboardPayload {
  totalPelanggan: number;
  totalBooking: number;
  totalSparepart: number;
  totalAdmin: number;
  lowStock: Sparepart[];
  recentBookings: Booking[];
  totalRequests?: number;
  waitingReview?: number;
  activeWorkOrders?: number;
  pendingApprovals?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  replacement: string;
  suitableFor: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description: string;
  managementCategory: string;
  products: Product[];
  replacementInfo: Array<{ label: string; value: string }>;
}

export interface ApiResult<T> {
  data: T;
  message?: string;
}