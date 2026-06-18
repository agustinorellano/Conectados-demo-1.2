export const colors = {
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue900: '#1E3A8A',
  blue50:  '#EFF6FF',
  bgHero:  'linear-gradient(170deg,#F0F4FF 0%,#EEF4FF 55%,#F5F7FF 100%)',
  surface: '#FFFFFF',
  dark:    '#0C091C',
  text1:   '#0F172A',
  text2:   '#64748B',
  text3:   '#94A3B8',
  border:  '#E2E8F0',
  borderB: '#BFDBFE',
}

export const shadows = {
  sm:    '0 2px 8px rgba(0,0,0,.05)',
  md:    '0 4px 24px rgba(0,0,0,.07)',
  lg:    '0 8px 32px rgba(0,0,0,.10)',
  phone: '0 0 0 1px rgba(255,255,255,.07), 0 0 0 10px #1c1c1e, 0 0 0 12px #2e2e2e, 0 36px 90px rgba(0,0,0,.28), 0 12px 32px rgba(0,0,0,.18)',
  card:  '0 20px 50px rgba(0,0,0,.22), 0 8px 20px rgba(0,0,0,.14)',
  blue:  '0 8px 28px rgba(37,99,235,.35)',
}

export const radii = {
  xs:    6,
  sm:    10,
  md:    14,
  lg:    18,
  xl:    20,
  xxl:   24,
  phone: 46,
  full:  999,
}

export const floatAnim = (duration = 5.5, delay = 0) => ({
  animate: { y: [0, -8, 0] },
  transition: { duration, ease: 'easeInOut', repeat: Infinity, delay },
})

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
})
