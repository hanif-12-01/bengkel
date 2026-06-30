import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getThemePreference, setThemePreference as storeThemePreference, simobsApi } from '../services/simobsService';
import type { Session, ThemeName, ThemePreference } from '../types';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

interface SimobsContextValue {
  session: Session | null;
  booting: boolean;
  theme: ThemeName;
  themePreference: ThemePreference;
  toast: ToastState | null;
  setThemePreference: (theme: ThemePreference) => void;
  refreshSession: () => Promise<void>;
  notify: (message: string, type?: ToastType) => void;
  logout: () => Promise<void>;
}

const SimobsContext = createContext<SimobsContextValue | undefined>(undefined);

function detectTheme(date = new Date()): ThemeName {
  const hour = date.getHours();
  if (hour >= 5 && hour <= 10) return 'morning';
  if (hour >= 11 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 20) return 'evening';
  return 'night';
}

function resolveTheme(preference: ThemePreference): ThemeName {
  return preference === 'auto' ? detectTheme() : preference;
}

export function SimobsProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(true);
  const [themePreferenceState, setThemePreferenceState] = useState<ThemePreference>(() => getThemePreference() as ThemePreference);
  const [theme, setTheme] = useState<ThemeName>(() => resolveTheme(themePreferenceState));
  const [toast, setToast] = useState<ToastState | null>(null);

  const refreshSession = useCallback(async () => {
    const next = await simobsApi.session();
    setSession(next);
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setBooting(false));
  }, [refreshSession]);

  useEffect(() => {
    const apply = () => setTheme(resolveTheme(themePreferenceState));
    apply();
    const timer = window.setInterval(apply, 60_000);
    return () => window.clearInterval(timer);
  }, [themePreferenceState]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#111620' : '#171814');
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ id: Date.now(), type, message });
  }, []);

  const setThemePreference = useCallback((next: ThemePreference) => {
    storeThemePreference(next);
    setThemePreferenceState(next);
  }, []);

  const logout = useCallback(async () => {
    await simobsApi.logout();
    setSession(null);
  }, []);

  const value = useMemo<SimobsContextValue>(() => ({
    session,
    booting,
    theme,
    themePreference: themePreferenceState,
    toast,
    setThemePreference,
    refreshSession,
    notify,
    logout,
  }), [session, booting, theme, themePreferenceState, toast, setThemePreference, refreshSession, notify, logout]);

  return <SimobsContext.Provider value={value}>{children}</SimobsContext.Provider>;
}

export function useSimobs() {
  const context = useContext(SimobsContext);
  if (!context) throw new Error('useSimobs must be used inside SimobsProvider');
  return context;
}
