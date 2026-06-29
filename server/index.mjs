import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'data', 'simobs.local.json');
const PORT = Number(process.env.PORT || 8787);
const OTP_TTL_MS = Number(process.env.OTP_TTL_MINUTES || 5) * 60 * 1000;
const sessions = new Map();

function nowIso() { return new Date().toISOString(); }
function id(prefix) { return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`; }
function normalizeEmail(value = '') { return value.trim().toLowerCase(); }
function normalizePhone(value = '') { const clean = value.trim().replace(/\s+/g, ''); if (clean.startsWith('0')) return `+62${clean.slice(1)}`; if (clean.startsWith('62')) return `+${clean}`; return clean; }
function hashPassword(password) { const salt = crypto.randomBytes(16).toString('base64'); const hash = crypto.pbkdf2Sync(password, salt, 210000, 32, 'sha256').toString('base64'); return `pbkdf2$210000$${salt}$${hash}`; }
function verifyPassword(password, stored) { const [scheme, iter, salt, hash] = String(stored || '').split('$'); if (scheme !== 'pbkdf2') return false; const next = crypto.pbkdf2Sync(password, salt, Number(iter), 32, 'sha256').toString('base64'); return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(next)); }
function hashOtp(code, salt) { return crypto.createHash('sha256').update(`${salt}:${code}`).digest('base64'); }

function seedDb() {
  const stamp = nowIso();
  return {
    users: [],
    admins: [],
    bookings: [],
    pelanggan: [{ id: 'plg_demo_1', source: 'admin', nama: 'Budi Santoso', alamat: 'Jl. Merdeka No. 21', telepon: '+628123456780', created_at: stamp }],
    sparepart: [
      { id: 'spr_oli_1', nama_sparepart: 'AHM MPX 2', kategori: 'Oli', stok: 3, harga: 55000, created_at: stamp, updated_at: stamp },
      { id: 'spr_busi_1', nama_sparepart: 'NGK CPR6EA', kategori: 'Busi', stok: 10, harga: 20000, created_at: stamp, updated_at: stamp },
      { id: 'spr_rem_1', nama_sparepart: 'Honda Beat / Vario', kategori: 'Kampas Rem', stok: 4, harga: 45000, created_at: stamp, updated_at: stamp },
      { id: 'spr_aki_1', nama_sparepart: 'Yuasa MF 5Ah', kategori: 'Aki', stok: 8, harga: 210000, created_at: stamp, updated_at: stamp }
    ],
    notifikasi: [],
    promo: [{ id: 'promo_1', judul: 'Paket Servis Berkala', nama: 'Paket Servis Berkala', deskripsi: 'Pemeriksaan CVT, rem, oli, dan kelistrikan.', diskon: 10, active: true }],
    pending_otps: []
  };
}

function loadDb() {
  if (!existsSync(DATA_FILE)) {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    const db = seedDb();
    writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    return db;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}
function saveDb(db) { writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }
function publicAdmin(admin) { const { password_hash, ...safe } = admin; return safe; }
function shortSort(bookings) { return [...bookings].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))); }
function addNotification(db, item) { db.notifikasi.push({ id: id('ntf'), created_at: nowIso(), ...item }); }
function statusMessage(status, booking) {
  const data = {
    Diproses: ['Servis Sedang Diproses', `Servis ${booking.jenis_servis} motor ${booking.motor} Anda sedang dikerjakan oleh mekanik.`],
    Selesai: ['Servis Selesai', `Servis ${booking.jenis_servis} motor ${booking.motor} Anda telah selesai. Silakan ambil kendaraan Anda.`],
    Ditunda: ['Servis Tertunda', `Servis ${booking.jenis_servis} motor ${booking.motor} Anda tertunda. Mohon tunggu konfirmasi lebih lanjut.`]
  };
  return data[status];
}

function json(res, status, data, extraHeaders = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': process.env.CORS_ORIGIN || 'http://localhost:5173', 'access-control-allow-credentials': 'true', ...extraHeaders });
  res.end(JSON.stringify(data));
}
function readBody(req) { return new Promise((resolve) => { let raw = ''; req.on('data', (chunk) => { raw += chunk; }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } }); }); }
function cookieToken(req) { const cookie = req.headers.cookie || ''; const found = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('simobs_session=')); return found ? found.split('=')[1] : ''; }
function auth(req, role) { const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); const session = sessions.get(bearer || cookieToken(req)); if (!session || (role && session.role !== role)) return null; return session; }
function sendUnauthorized(res) { json(res, 401, { error: 'Unauthorized' }); }

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const parts = path.split('/').filter(Boolean);
  const db = loadDb();

  try {
    if (req.method === 'POST' && path === '/auth/customer/register') {
      const body = await readBody(req);
      if (body.password !== body.confirmPassword) return json(res, 400, { error: 'Password dan konfirmasi password tidak sama.' });
      if (db.users.some((u) => normalizeEmail(u.email) === normalizeEmail(body.email))) return json(res, 409, { error: 'Email sudah digunakan.' });
      const user = { id: id('usr'), nama: body.nama, email: normalizeEmail(body.email), no_hp: normalizePhone(body.no_hp), password_hash: hashPassword(body.password), created_at: nowIso(), vehicle_profile: { model: '', tahun: '', plat: '', warna: '', terakhir_servis: '' } };
      db.users.push(user); saveDb(db); return json(res, 201, { id: user.id, nama: user.nama, email: user.email });
    }
    if (req.method === 'POST' && path === '/auth/customer/login') {
      const body = await readBody(req);
      const identifier = String(body.identifier || body.user || '').toLowerCase();
      const user = db.users.find((u) => u.email === identifier || normalizePhone(u.no_hp) === normalizePhone(identifier));
      if (!user || !verifyPassword(body.password || '', user.password_hash)) return json(res, 401, { error: 'Email/No HP atau password salah.' });
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const salt = crypto.randomBytes(12).toString('base64');
      const pending = { id: id('otp'), user_id: user.id, user_email: user.email, salt, code_hash: hashOtp(code, salt), expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(), attempts: 0, created_at: nowIso() };
      db.pending_otps = db.pending_otps.filter((o) => o.user_id !== user.id);
      db.pending_otps.push(pending); saveDb(db);
      return json(res, 200, { pending_id: pending.id, email: user.email, expires_at: pending.expires_at, dev_otp: process.env.NODE_ENV === 'production' ? undefined : code });
    }
    if (req.method === 'POST' && path === '/auth/customer/verify-otp') {
      const body = await readBody(req);
      const pending = db.pending_otps.find((o) => o.id === body.pending_id);
      if (!pending || new Date(pending.expires_at).getTime() < Date.now()) return json(res, 400, { error: 'OTP tidak valid atau kedaluwarsa.' });
      if (hashOtp(String(body.otp || ''), pending.salt) !== pending.code_hash) { pending.attempts += 1; saveDb(db); return json(res, 400, { error: 'OTP salah.' }); }
      const user = db.users.find((u) => u.id === pending.user_id);
      const token = id('ses');
      const session = { role: 'customer', id: user.id, nama: user.nama, email: user.email, verified_at: nowIso() };
      sessions.set(token, session); db.pending_otps = db.pending_otps.filter((o) => o.id !== pending.id); saveDb(db);
      return json(res, 200, { token, session }, { 'set-cookie': `simobs_session=${token}; HttpOnly; SameSite=Lax; Path=/` });
    }
    if (req.method === 'POST' && path === '/auth/admin/register') {
      const body = await readBody(req);
      const username = String(body.username || '').toLowerCase();
      if (db.admins.some((a) => a.username === username)) return json(res, 409, { error: 'Username sudah digunakan.' });
      const admin = { id: id('adm'), nama: body.nama, username, password_hash: hashPassword(body.password), created_at: nowIso() };
      db.admins.push(admin); saveDb(db); return json(res, 201, publicAdmin(admin));
    }
    if (req.method === 'POST' && path === '/auth/admin/login') {
      const body = await readBody(req);
      const admin = db.admins.find((a) => a.username === String(body.username || '').toLowerCase());
      if (!admin || !verifyPassword(body.password || '', admin.password_hash)) return json(res, 401, { error: 'Username atau password salah.' });
      const token = id('ses'); const session = { role: 'admin', id: admin.id, nama: admin.nama, username: admin.username, verified_at: nowIso() };
      sessions.set(token, session); return json(res, 200, { token, session }, { 'set-cookie': `simobs_session=${token}; HttpOnly; SameSite=Lax; Path=/` });
    }
    if (req.method === 'GET' && path === '/auth/session') return json(res, 200, { session: auth(req) });
    if (req.method === 'POST' && path === '/auth/logout') { sessions.delete(cookieToken(req)); return json(res, 200, { success: true }, { 'set-cookie': 'simobs_session=; Max-Age=0; Path=/' }); }

    if (parts[0] === 'customer') {
      const session = auth(req, 'customer'); if (!session) return sendUnauthorized(res);
      const user = db.users.find((u) => u.id === session.id);
      const ownBookings = () => shortSort(db.bookings.filter((b) => b.user_id === session.id || b.user_email === session.email));
      if (req.method === 'GET' && path === '/customer/dashboard') return json(res, 200, { nama: user.nama, lastBooking: ownBookings()[0] || null, promos: db.promo.filter((p) => p.active).slice(0, 3), unreadNotifications: db.notifikasi.filter((n) => n.user_email === session.email && !n.dibaca).length });
      if (req.method === 'GET' && path === '/customer/profile') return json(res, 200, user);
      if (req.method === 'PUT' && path === '/customer/profile') { const body = await readBody(req); Object.assign(user, body, { email: body.email ? normalizeEmail(body.email) : user.email, no_hp: body.no_hp ? normalizePhone(body.no_hp) : user.no_hp }); saveDb(db); return json(res, 200, user); }
      if (req.method === 'GET' && path === '/customer/bookings') return json(res, 200, ownBookings());
      if (req.method === 'POST' && path === '/customer/bookings') { const body = await readBody(req); const booking = { id: id('svc'), user_id: user.id, user_email: user.email, nama: user.nama, nama_pelanggan: user.nama, motor: body.motor, plat: body.plat, jenis_servis: body.jenis_servis, tanggal: body.tanggal, waktu: body.waktu, keluhan: body.keluhan, status: 'Menunggu', estimasi_selesai: '', mekanik: '', catatan_admin: '', sparepart_diganti: '', total_sparepart: 0, source: 'customer', created_at: nowIso(), updated_at: nowIso() }; db.bookings.push(booking); addNotification(db, { user_id: user.id, user_email: user.email, judul: 'Booking Berhasil Dibuat', pesan: `Booking servis ${booking.jenis_servis} untuk motor ${booking.motor} berhasil dibuat.`, tipe: 'booking', booking_id: booking.id, dibaca: false }); saveDb(db); return json(res, 201, booking); }
      if (req.method === 'GET' && parts[1] === 'bookings' && parts[2]) { const booking = ownBookings().find((b) => b.id === parts[2]); return booking ? json(res, 200, booking) : json(res, 404, { error: 'Not found' }); }
      if (req.method === 'GET' && path === '/customer/status') return json(res, 200, ownBookings());
      if (req.method === 'GET' && path === '/customer/notifications') return json(res, 200, db.notifikasi.filter((n) => n.user_email === session.email).sort((a, b) => b.created_at.localeCompare(a.created_at)));
      if (req.method === 'PATCH' && parts[1] === 'notifications' && parts[3] === 'read') { const n = db.notifikasi.find((item) => item.id === parts[2] && item.user_email === session.email); if (n) n.dibaca = true; saveDb(db); return json(res, 200, n || null); }
      if (req.method === 'GET' && path === '/customer/spareparts') return json(res, 200, db.sparepart);
      if (req.method === 'GET' && parts[1] === 'spareparts' && parts[2]) return json(res, 200, db.sparepart.filter((s) => s.kategori.toLowerCase() === decodeURIComponent(parts[2]).toLowerCase()));
    }

    if (parts[0] === 'admin') {
      const session = auth(req, 'admin'); if (!session) return sendUnauthorized(res);
      if (req.method === 'GET' && path === '/admin/dashboard') return json(res, 200, { totalPelanggan: db.users.length + db.pelanggan.length, totalBooking: db.bookings.length, totalSparepart: db.sparepart.length, totalAdmin: db.admins.length, lowStock: db.sparepart.filter((s) => Number(s.stok) < 5), recentBookings: shortSort(db.bookings).slice(0, 5) });
      if (req.method === 'GET' && path === '/admin/admins') return json(res, 200, db.admins.map(publicAdmin));
      if (req.method === 'GET' && path === '/admin/pelanggan') { const q = (url.searchParams.get('keyword') || '').toLowerCase(); const registered = db.users.map((u) => ({ id: u.id, source: 'user', nama: u.nama, alamat: u.email, telepon: u.no_hp, created_at: u.created_at })); const rows = [...registered, ...db.pelanggan].filter((p) => !q || `${p.nama} ${p.alamat} ${p.telepon}`.toLowerCase().includes(q)); return json(res, 200, rows); }
      if (req.method === 'POST' && path === '/admin/pelanggan') { const b = await readBody(req); const row = { id: id('plg'), source: 'admin', nama: b.nama, alamat: b.alamat, telepon: normalizePhone(b.telepon), created_at: nowIso() }; db.pelanggan.push(row); saveDb(db); return json(res, 201, row); }
      if (req.method === 'PUT' && parts[1] === 'pelanggan') { const b = await readBody(req); const row = db.pelanggan.find((p) => p.id === parts[2]); if (!row) return json(res, 404, { error: 'Not found' }); Object.assign(row, b); saveDb(db); return json(res, 200, row); }
      if (req.method === 'DELETE' && parts[1] === 'pelanggan') { if (parts[2] === 'admin') db.pelanggan = db.pelanggan.filter((p) => p.id !== parts[3]); saveDb(db); return json(res, 200, { success: true }); }
      if (req.method === 'GET' && path === '/admin/bookings') { const q = (url.searchParams.get('keyword') || '').toLowerCase(); return json(res, 200, shortSort(db.bookings).filter((b) => !q || `${b.nama_pelanggan} ${b.motor} ${b.mekanik} ${b.status} ${b.keluhan}`.toLowerCase().includes(q))); }
      if (req.method === 'POST' && path === '/admin/bookings') { const b = await readBody(req); const booking = { id: id('svc'), status: 'Menunggu', source: 'admin', created_at: nowIso(), updated_at: nowIso(), estimasi_selesai: '', mekanik: '', catatan_admin: '', sparepart_diganti: '', total_sparepart: 0, ...b }; db.bookings.push(booking); saveDb(db); return json(res, 201, booking); }
      if (req.method === 'GET' && parts[1] === 'bookings' && parts[2]) { const row = db.bookings.find((b) => b.id === parts[2]); return row ? json(res, 200, row) : json(res, 404, { error: 'Not found' }); }
      if (req.method === 'PUT' && parts[1] === 'bookings') { const b = await readBody(req); const row = db.bookings.find((x) => x.id === parts[2]); if (!row) return json(res, 404, { error: 'Not found' }); const oldStatus = row.status; Object.assign(row, b, { updated_at: nowIso() }); if (row.user_email && oldStatus !== row.status) { const message = statusMessage(row.status, row); if (message) addNotification(db, { user_id: row.user_id, user_email: row.user_email, judul: message[0], pesan: message[1], tipe: 'status', booking_id: row.id, dibaca: false }); } saveDb(db); return json(res, 200, row); }
      if (req.method === 'DELETE' && parts[1] === 'bookings') { db.bookings = db.bookings.filter((b) => b.id !== parts[2]); saveDb(db); return json(res, 200, { success: true }); }
      if (req.method === 'GET' && path === '/admin/spareparts') { const q = (url.searchParams.get('keyword') || '').toLowerCase(); const k = url.searchParams.get('kategori') || ''; return json(res, 200, db.sparepart.filter((s) => (!q || `${s.nama_sparepart} ${s.kategori}`.toLowerCase().includes(q)) && (!k || s.kategori === k))); }
      if (req.method === 'POST' && path === '/admin/spareparts') { const b = await readBody(req); const row = { id: id('spr'), created_at: nowIso(), updated_at: nowIso(), ...b }; db.sparepart.push(row); saveDb(db); return json(res, 201, row); }
      if (req.method === 'PUT' && parts[1] === 'spareparts') { const b = await readBody(req); const row = db.sparepart.find((s) => s.id === parts[2]); if (!row) return json(res, 404, { error: 'Not found' }); Object.assign(row, b, { updated_at: nowIso() }); saveDb(db); return json(res, 200, row); }
      if (req.method === 'DELETE' && parts[1] === 'spareparts') { db.sparepart = db.sparepart.filter((s) => s.id !== parts[2]); saveDb(db); return json(res, 200, { success: true }); }
    }

    return json(res, 404, { error: 'Route not found' });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Server error' });
  }
}).listen(PORT, () => {
  console.log(`SIMOBS local API running on http://localhost:${PORT}`);
});
