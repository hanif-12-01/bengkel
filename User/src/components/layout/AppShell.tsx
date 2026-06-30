import { NavLink } from "react-router-dom";
import {
  CalendarCheck,
  Car,
  ClipboardList,
  Menu,
  Settings,
  Wrench,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  // Susun navItems secara dinamis berdasarkan role pengguna
  const getNavItems = () => {
    const items = [
      { label: "Beranda", to: "/", icon: Car },
      { label: "Layanan", to: "/layanan", icon: Wrench },
    ];

    if (!user) {
      // Tamu tidak memiliki akses ke booking / status
      return items;
    }

    if (user.role === "customer") {
      items.push({ label: "Booking", to: "/booking", icon: CalendarCheck });
      items.push({ label: "Status Booking", to: "/status", icon: ClipboardList });
    }

    if (user.role === "admin" || user.role === "mechanic") {
      items.push({ label: "Dashboard", to: "/admin", icon: Settings });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-black leading-none text-slate-950">
                Bengkel Booking
              </p>
              <p className="text-xs font-semibold text-slate-500">
                Servis mobil & motor
              </p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2 ml-2">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{user.name.split(" ")[0]}</span>
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2 ml-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  Masuk
                </NavLink>
              </div>
            )}
          </nav>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <UserIcon className="h-4 w-4" />
                    Profil ({user.name})
                  </NavLink>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <UserIcon className="h-4 w-4" />
                  Masuk
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}