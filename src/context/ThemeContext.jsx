import { createContext, useContext, useEffect, useState } from 'react';

/* ─── Design tokens ─────────────────────────────────────── */
export const THEMES = {
  dark: {
    isDark: true,
    /* Backgrounds */
    bg:            '#070C18',
    panelBg:       '#0A0F1E',
    panelBorder:   'rgba(255,255,255,0.06)',
    sidebarBg:     'linear-gradient(180deg, rgba(8,14,28,0.98) 0%, rgba(6,10,22,0.98) 100%)',
    sidebarBorder: 'rgba(255,255,255,0.07)',
    sidebarDivider:'rgba(255,255,255,0.06)',
    /* Surfaces */
    surface:       'rgba(255,255,255,0.06)',
    surface2:      'rgba(255,255,255,0.10)',
    surfaceBorder: 'rgba(255,255,255,0.08)',
    /* Text */
    text1:         'rgba(255,255,255,0.90)',
    text2:         'rgba(255,255,255,0.45)',
    text3:         'rgba(255,255,255,0.28)',
    textWhite:     '#FFFFFF',
    /* Accent */
    accent:        '#2563EB',
    accentMid:     '#4A9FFF',
    accentActive:  'rgba(24,113,216,0.18)',
    accentBorder:  'rgba(24,113,216,0.30)',
    /* Nav — web sidebar */
    navIcon:       'rgba(255,255,255,0.35)',
    navIconActive: '#60A5FA',
    navText:       'rgba(255,255,255,0.45)',
    navTextActive: '#FFFFFF',
    /* Nav — mobile bottom pill */
    navPill:       'rgba(22,24,28,0.82)',
    navPillText:   'rgba(255,255,255,0.35)',
    navPillActive: '#FFFFFF',
    navPillActiveSub: '#7EB8D4',
    navPillActiveBg: 'linear-gradient(135deg, #243B55 0%, #35577D 100%)',
    navPillShadow: '0 12px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07)',
    /* Sidebar search */
    searchBg:      'rgba(255,255,255,0.06)',
    searchBorder:  'rgba(255,255,255,0.09)',
    searchFocusBg: 'rgba(24,113,216,0.12)',
    searchFocusBorder: 'rgba(24,113,216,0.35)',
    searchIcon:    'rgba(255,255,255,0.30)',
    searchText:    '#FFFFFF',
    searchPlaceholder: 'rgba(255,255,255,0.25)',
    /* Dropdown */
    dropdownBg:    'rgba(14,22,44,0.98)',
    dropdownBorder:'rgba(255,255,255,0.12)',
    /* Plan badge */
    planBg:        'rgba(255,255,255,0.06)',
    planBorder:    'rgba(255,255,255,0.10)',
    planText:      'rgba(255,255,255,0.55)',
  },
  /* Light — estilo Apple sobre la paleta de Conectado Flow (índigo hsl(232 78% 59%), Inter) */
  light: {
    isDark: false,
    /* Backgrounds */
    bg:            '#F5F6FA',
    panelBg:       '#FFFFFF',
    panelBorder:   'rgba(15,23,42,0.07)',
    sidebarBg:     'rgba(255,255,255,0.78)',
    sidebarBorder: 'rgba(15,23,42,0.07)',
    sidebarDivider:'rgba(15,23,42,0.06)',
    /* Surfaces */
    surface:       '#FFFFFF',
    surface2:      '#F0F2F8',
    surfaceBorder: 'rgba(15,23,42,0.07)',
    /* Text */
    text1:         '#1D1D1F',
    text2:         '#515257',
    text3:         '#86868B',
    textWhite:     '#1D1D1F',
    /* Accent */
    accent:        '#455BE8',
    accentMid:     '#455BE8',
    accentActive:  'rgba(69,91,232,0.10)',
    accentBorder:  'rgba(69,91,232,0.22)',
    /* Nav — web sidebar */
    navIcon:       '#86868B',
    navIconActive: '#455BE8',
    navText:       '#515257',
    navTextActive: '#1D1D1F',
    /* Nav — mobile bottom pill */
    navPill:       'rgba(255,255,255,0.86)',
    navPillText:   '#86868B',
    navPillActive: '#1D1D1F',
    navPillActiveSub: '#455BE8',
    navPillActiveBg: 'linear-gradient(135deg, #EEF0FD 0%, #E0E5FC 100%)',
    navPillShadow: '0 12px 40px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.06)',
    /* Sidebar search */
    searchBg:      'rgba(15,23,42,0.05)',
    searchBorder:  'transparent',
    searchFocusBg: '#FFFFFF',
    searchFocusBorder: 'rgba(69,91,232,0.45)',
    searchIcon:    '#86868B',
    searchText:    '#1D1D1F',
    searchPlaceholder: '#A1A1A6',
    /* Dropdown */
    dropdownBg:    'rgba(255,255,255,0.96)',
    dropdownBorder:'rgba(15,23,42,0.08)',
    /* Plan badge */
    planBg:        'rgba(15,23,42,0.05)',
    planBorder:    'rgba(15,23,42,0.08)',
    planText:      '#515257',
  },
};

const ThemeContext = createContext(null);

// Oscuro es el predeterminado en toda la plataforma; el tema claro (estilo Conectado Flow / Apple)
// se activa desde Configuración (o con el botón del menú en /web). Clave v3 para que todos
// vuelvan al oscuro aunque hubieran guardado el claro en pruebas anteriores.
const STORAGE_KEY = 'app-theme-v3';
const DEFAULT_THEME = 'dark';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME; } catch { return DEFAULT_THEME; }
  });

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, t: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: 'dark', toggleTheme: () => {}, t: THEMES.dark };
  return ctx;
}
