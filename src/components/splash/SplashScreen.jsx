import { motion } from 'framer-motion';
import { useEffect } from 'react';

const SAT_DATA = [
  { id: 'tl', cx: 52,  cy: 52,  r: 16, d: 'M 100 100 L 52 52'   },
  { id: 'tr', cx: 152, cy: 56,  r: 16, d: 'M 100 100 L 152 56'  },
  { id: 'bl', cx: 48,  cy: 148, r: 11, d: 'M 100 100 L 48 148'  },
  { id: 'br', cx: 152, cy: 150, r: 11, d: 'M 100 100 L 152 150' },
];

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const t = window.setTimeout(onComplete, 3800);
    return () => window.clearTimeout(t);
  }, [onComplete]);

  return (
    <section
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050A16' }}
    >
      {/* Ambient glow — appears when hub forms */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% 46%, rgba(30,79,204,0.22), transparent)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.0 }}
      />

      {/* Logo SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        style={{ width: 224, height: 224 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <radialGradient id="sp-bg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#0E2045" />
            <stop offset="60%" stopColor="#07112A" />
            <stop offset="100%" stopColor="#030810" />
          </radialGradient>
          <radialGradient id="sp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E4FCC" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1E4FCC" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sp-hub" x1="20%" y1="5%" x2="80%" y2="95%">
            <stop offset="0%" stopColor="#72C2FF" />
            <stop offset="50%" stopColor="#2668EC" />
            <stop offset="100%" stopColor="#1820B4" />
          </linearGradient>
          <linearGradient id="sp-sat" x1="20%" y1="5%" x2="80%" y2="95%">
            <stop offset="0%" stopColor="#78CAFF" />
            <stop offset="55%" stopColor="#3274F2" />
            <stop offset="100%" stopColor="#2222C4" />
          </linearGradient>
          <filter id="sp-blur-hub" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="sp-blur-sat" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Background rounded rect */}
        <rect width="200" height="200" rx="46" fill="url(#sp-bg)" />

        {/* Hub ambient glow (blurred) */}
        <motion.circle
          cx={100} cy={100} r={52}
          fill="url(#sp-glow)"
          filter="url(#sp-blur-hub)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Satellite glows — appear when sats return to position */}
        {SAT_DATA.map((s, i) => (
          <motion.circle
            key={`sg-${s.id}`}
            cx={s.cx} cy={s.cy}
            r={s.r > 12 ? 18 : 13}
            fill="#2060DD"
            filter="url(#sp-blur-sat)"
            initial={{ opacity: 0 }}
            animate={{ opacity: s.r > 12 ? 0.35 : 0.25 }}
            transition={{ delay: 1.55 + i * 0.06, duration: 0.35 }}
          />
        ))}

        {/* Wires — draw from center outward after sats return */}
        {SAT_DATA.map((s, i) => (
          <motion.path
            key={`w-${s.id}`}
            d={s.d}
            stroke="rgba(74,136,255,0.5)"
            strokeWidth={s.r > 12 ? 1.6 : 1.4}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5 + i * 0.07, duration: 0.38, ease: 'easeOut' }}
          />
        ))}

        {/* Hub circle */}
        <motion.circle
          cx={100} cy={100} r={32}
          fill="url(#sp-hub)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.0, duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Satellite dots — appear at corners, fly to center, return */}
        {SAT_DATA.map((s, i) => (
          <motion.circle
            key={s.id}
            fill="url(#sp-sat)"
            initial={{ r: 0, cx: s.cx, cy: s.cy }}
            animate={{
              r: s.r,
              cx: [s.cx, 100, s.cx],
              cy: [s.cy, 100, s.cy],
            }}
            transition={{
              r:  { delay: 0.18 + i * 0.08, duration: 0.26, ease: [0.34, 1.56, 0.64, 1] },
              cx: { delay: 0.48, duration: 1.02, times: [0, 0.46, 1], ease: 'easeInOut' },
              cy: { delay: 0.48, duration: 1.02, times: [0, 0.46, 1], ease: 'easeInOut' },
            }}
          />
        ))}
      </motion.svg>

      {/* "Conectados" — fades in after animation settles */}
      <motion.h1
        className="mt-10 font-['Space_Grotesk'] text-[44px] font-bold tracking-tight text-white"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        Conectados
      </motion.h1>
    </section>
  );
}

export default SplashScreen;
