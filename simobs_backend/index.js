const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
const users = [
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890' }
];

const vehicles = [
  { id: 1, userId: 1, type: 'Car', make: 'Toyota', model: 'Avanza', year: '2019', plateNumber: 'B 1234 ABC' },
  { id: 2, userId: 1, type: 'Motorcycle', make: 'Honda', model: 'Beat', year: '2021', plateNumber: 'B 5678 XYZ' }
];

const bookings = [
  { id: 1, userId: 1, vehicleId: 1, date: '2026-07-01', time: '10:00', serviceType: 'Service Rutin', status: 'Pending' }
];

// --- ENDPOINTS ---

app.get('/', (req, res) => {
  res.send('SIMOBS Backend API is running!');
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, phone, email, password } = req.body;
  const newUser = { id: users.length + 1, name, phone, email };
  users.push(newUser);
  res.status(201).json({ message: 'Registration successful', user: newUser });
});

// Profile
app.get('/api/profile/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

// Vehicles
app.get('/api/vehicles/:userId', (req, res) => {
  const userVehicles = vehicles.filter(v => v.userId === parseInt(req.params.userId));
  res.json(userVehicles);
});

// Bookings
app.get('/api/bookings/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId === parseInt(req.params.userId));
  res.json(userBookings);
});

app.post('/api/bookings', (req, res) => {
  const { userId, vehicleId, date, time, serviceType } = req.body;
  const newBooking = {
    id: bookings.length + 1,
    userId,
    vehicleId,
    date,
    time,
    serviceType,
    status: 'Pending'
  };
  bookings.push(newBooking);
  res.status(201).json({ message: 'Booking created', booking: newBooking });
});

app.listen(port, () => {
  console.log(`SIMOBS Backend Server is running on port ${port}`);
});