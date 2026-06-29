import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Phone, Mail, MapPin, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl text-primary-foreground font-bold mb-4 shadow-lg ring-4 ring-primary/20">
                JD
              </div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-primary font-medium">Premium Member</p>
              <p className="text-xs text-muted-foreground mt-1">Bergabung sejak Okt 2023</p>
              
              <div className="w-full border-t border-border mt-6 pt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                  <Shield className="w-4 h-4 mr-2" /> Keamanan Akun
                </Button>
                <Button variant="danger" className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border-none">
                  <LogOut className="w-4 h-4 mr-2" /> Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b border-border pb-2">Informasi Pribadi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" /> <span>Nama Lengkap</span>
                    </label>
                    <Input defaultValue="John Doe" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" /> <span>Nomor Telepon</span>
                    </label>
                    <Input defaultValue="081234567890" type="tel" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> <span>Email</span>
                    </label>
                    <Input defaultValue="john.doe@example.com" type="email" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" /> <span>Alamat (Opsional)</span>
                    </label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      defaultValue="Jl. Sudirman No. 123, Jakarta"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button>Simpan Perubahan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}