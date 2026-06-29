import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Bike,
  CalendarClock,
  Car,
  CarFront,
  ClipboardList,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button, ToastView } from "../ui";
import { cn } from "../../lib/utils";
import { useSimobs } from "../../context/SimobsContext";
import type { Role } from "../../types";

const customerLinks = [
  { to: "/app/dashboard", label: "Beranda", icon: LayoutDashboard },
  { to: "/app/booking", label: "Booking", icon: CalendarClock },
  { to: "/app/status", label: "Status", icon: ClipboardList },
  { to: "/app/history", label: "Riwayat", icon: History },
  { to: "/app/spareparts", label: "Sparepart", icon: Package },
  { to: "/app/vehicles", label: "Garasi", icon: Bike },
  { to: "/app/profile", label: "Profil", icon: User },
  { to: "/app/settings", label: "Pengaturan", icon: Settings },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/admin/pelanggan", label: "Pelanggan", icon: Users },
  { to: "/admin/bookings", label: "Booking", icon: Wrench },
  { to: "/admin/spareparts", label: "Sparepart", icon: Package },
  { to: "/admin/admins", label: "Data Admin", icon: ShieldCheck },
];

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-accent text-accent-foreground shadow-soft">
        <CarFront className="h-5 w-5" />
      </div>
      <div>
        <div className="text-base font-extrabold tracking-wide text-text">
          SIMOBS
        </div>
        <div className="text-xs font-medium text-muted">
          Sistem Booking Servis
        </div>
      </div>
    </div>
  );
}

function Sidebar({ role }: { role: Role }) {
  const links = role === "admin" ? adminLinks : customerLinks;
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-surface/90 px-5 py-6 backdrop-blur lg:block">
      <LogoMark />
      <nav className="mt-8 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-sm font-semibold text-muted transition hover:bg-surfaceSoft hover:text-text",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function MobileBottomNav({ role }: { role: Role }) {
  const links =
    role === "admin" ? adminLinks.slice(0, 4) : customerLinks.slice(0, 5);
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pt-2 shadow-2xl backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1 sm:grid-cols-5">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[8px] text-[11px] font-semibold text-muted transition",
                isActive && "bg-primary text-primary-foreground",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="max-w-full truncate px-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Topbar({ role }: { role: Role }) {
  const { session, logout } = useSimobs();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate(role === "admin" ? "/admin/login" : "/login", { replace: true });
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/82 px-4 py-3 backdrop-blur lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="lg:hidden">
          <LogoMark />
        </div>
        <div className="hidden lg:block">
          <p className="text-sm text-muted">
            {role === "admin" ? "Workshop Management" : "Customer Application"}
          </p>
          <p className="font-semibold text-text">{session?.nama ?? "SIMOBS"}</p>
        </div>
        <div className="flex items-center gap-2">
          {role === "customer" && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => navigate("/app/notifications")}
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}
          <div className="hidden items-center gap-3 rounded-[8px] border border-border bg-surface px-3 py-2 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-accent/15 text-sm font-bold text-accent">
              {session?.nama?.slice(0, 1).toUpperCase() ?? "S"}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-text">{session?.nama}</div>
              <div className="text-xs text-muted">
                {role === "admin" ? session?.username : session?.email}
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function AppShell({ role }: { role: Role }) {
  const { toast } = useSimobs();
  return (
    <div className="min-h-screen text-text">
      {toast && (
        <ToastView key={toast.id} type={toast.type} message={toast.message} />
      )}
      <div className="flex min-h-screen">
        <Sidebar role={role} />
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          <Topbar role={role} />
          <main className="shell-scroll mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileBottomNav role={role} />
    </div>
  );
}
