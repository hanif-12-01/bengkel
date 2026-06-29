import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarPlus, Clock, User, Settings, Bell, Car } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const NAV_ITEMS = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Booking', path: '/dashboard/booking', icon: CalendarPlus },
  { name: 'History', path: '/dashboard/history', icon: Clock },
  { name: 'Vehicles', path: '/dashboard/vehicles', icon: Car },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

function SidebarLink({ item }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={cn(
        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium',
        isActive
          ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
          : 'text-muted hover:bg-primary/10 hover:text-primary hover:scale-[1.02]'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{item.name}</span>
    </NavLink>
  );
}

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-surface">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary tracking-tight">SIMOBS</span>
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Premium Auto Service</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-6 border-t border-border/50">
          <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-muted font-medium hover:bg-primary/10 hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-5 border-b border-border/50 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
          <span className="text-xl font-bold text-primary tracking-tight">SIMOBS</span>
          <button className="p-2 rounded-full hover:bg-primary/10 text-text transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface"></span>
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end p-6 border-b border-border/50 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center space-x-6">
            <button className="p-2 rounded-full hover:bg-primary/10 text-muted hover:text-primary transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center space-x-4 pl-6 border-l border-border/50">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text">John Doe</span>
                <span className="text-xs text-muted font-medium">Premium Member</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface/80 backdrop-blur-lg z-20 pb-safe">
        <div className="flex items-center justify-around p-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                    isActive ? 'text-primary' : 'text-muted hover:text-text'
                  )
                }
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}