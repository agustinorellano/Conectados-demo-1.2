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
  light: {
    isDark: false,
    /* Backgrounds */
    bg:            '#EEF2FF',
    panelBg:       '#FFFFFF',
    panelBorder:   'rgba(20,30,48,0.08)',
    sidebarBg:     'linear-gradient(180deg, #F8FAFF 0%, #EEF2FF 100%)',
    sidebarBorder: 'rgba(20,30,48,0.08)',
    sidebarDivider:'rgba(20,30,48,0.07)',
    /* Surfaces */
    surface:       'rgba(20,30,48,0.04)',
    surface2:      'rgba(20,30,48,0.08)',
    surfaceBorder: 'rgba(20,30,48,0.08)',
    /* Text */
    text1:         '#0F172A',
    text2:         '#475569',
    text3:         '#94A3B8',
    textWhite:     '#0F172A',
    /* Accent */
    accent:        '#2563EB',
    accentMid:     '#2563EB',
    accentActive:  'rgba(37,99,235,0.10)',
    accentBorder:  'rgba(37,99,235,0.25)',
    /* Nav — web sidebar */
    navIcon:       '#94A3B8',
    navIconActive: '#2563EB',
    navText:       '#64748B',
    navTextActive: '#0F172A',
    /* Nav — mobile bottom pill */
    navPill:       'rgba(255,255,255,0.94)',
    navPillText:   '#64748B',
    navPillActive: '#0F172A',
    navPillActiveSub: '#2563EB',
    navPillActiveBg: 'linear-gradient(135deg, #EEF2FF 0%, #DBEAFE 100%)',
    navPillShadow: '0 12px 40px rgba(20,30,48,0.12), 0 2px 8px rgba(20,30,48,0.08), 0 0 0 1px rgba(20,30,48,0.08)',
    /* Sidebar search */
    searchBg:      'rgba(20,30,48,0.05)',
    searchBorder:  'rgba(20,30,48,0.10)',
    searchFocusBg: 'rgba(37,99,235,0.06)',
    searchFocusBorder: 'rgba(37,99,235,0.30)',
    searchIcon:    '#94A3B8',
    searchText:    '#0F172A',
    searchPlaceholder: '#94A3B8',
    /* Dropdown */
    dropdownBg:    '#FFFFFF',
    dropdownBorder:'rgba(20,30,48,0.10)',
    /* Plan badge */
    planBg:        'rgba(20,30,48,0.05)',
    planBorder:    'rgba(20,30,48,0.10)',
    planText:      '#64748B',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('app-theme') || 'dark'; } catch { return 'dark'; }
  });

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    try { localStorage.setItem('app-theme', theme); } catch {}
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
