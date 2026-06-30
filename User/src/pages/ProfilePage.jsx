import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Phone, Mail, MapPin, LogOut } from 'lucide-react';
import { clearSession, getInitials, getProfile, saveProfile } from '../lib/storage';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getProfile);
  const [message, setMessage] = useState('');

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!profile.fullName.trim() || !profile.phone.trim() || !profile.email.trim()) {
      setMessage('Nama, nomor telepon, dan email wajib diisi.');
      return;
    }

    const saved = {
      fullName: profile.fullName.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      address: profile.address.trim(),
    };

    saveProfile(saved);
    setProfile(saved);
    setMessage('Profil berhasil disimpan.');
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl border text-sm font-medium ${
          message.includes('berhasil')
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl text-primary-foreground font-bold mb-4 shadow-lg ring-4 ring-primary/20">
                {getInitials(profile.fullName)}
              </div>
              <h2 className="text-xl font-bold">{profile.fullName || 'Pelanggan'}</h2>
              <p className="text-sm text-primary font-medium">Premium Member</p>
              <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>

              <div className="w-full border-t border-border mt-6 pt-6 space-y-3">
                <Button onClick={handleLogout} variant="danger" className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border-none">
                  <LogOut className="w-4 h-4 mr-2" /> Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card>
            <form onSubmit={handleSave}>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-border pb-2">Informasi Pribadi</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" /> <span>Nama Lengkap</span>
                      </label>
                      <Input value={profile.fullName} onChange={(e) => updateProfile('fullName', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> <span>Nomor Telepon</span>
                      </label>
                      <Input value={profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} type="tel" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" /> <span>Email</span>
                      </label>
                      <Input value={profile.email} onChange={(e) => updateProfile('email', e.target.value)} type="email" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" /> <span>Alamat</span>
                      </label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        value={profile.address}
                        onChange={(e) => updateProfile('address', e.target.value)}
                        placeholder="Alamat lengkap"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit">Simpan Perubahan</Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}