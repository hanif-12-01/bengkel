import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import VehiclesPage from './pages/VehiclesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Welcome Page */}
          <Route path="/" element={<WelcomePage />} />

          {/* Auth Routes without Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main App Routes with Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;