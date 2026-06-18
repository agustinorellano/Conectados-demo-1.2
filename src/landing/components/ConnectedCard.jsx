import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { floatAnim } from './tokens'

const COFFEE_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=160&q=80'

const CONFETTI = [
  { top: 14, left: 18, rotate: 30, w: 10, h: 4, color: '#3B82F6' },
  { top: 22, left: 44, rotate: -20, w: 7, h: 3, color: '#93C5FD' },
  { top: 10, left: 110, rotate: 50, w: 8, h: 3, color: '#2563EB' },
  { top: 30, right: 40, rotate: -40, w: 10, h: 4, color: '#60A5FA' },
  { top: 18, right: 18, rotate: 15, w: 7, h: 3, color: '#3B82F6' },
  { bottom: 30, left: 16, rotate: -25, w: 8, h: 3, color: '#93C5FD' },
  { bottom: 18, left: 60, rotate: 45, w: 6, h: 3, color: '#2563EB' },
  { bottom: 24, right: 50, rotate: -15, w: 9, h: 3, color: '#60A5FA' },
  { bottom: 14, right: 22, rotate: 35, w: 7, h: 3, color: '#3B82F6' },
]

export default function ConnectedCard() {
  const { animate, transition } = floatAnim(4.5, 0.2)
  return (
    <motion.div
      animate={animate}
      transition={transition}
      style={{
        background: '#fff',
        borderRadius: 22,
        border: '1px solid #E2E8F0',
        padding: '20px 20px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetti */}
      {CONFETTI.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          width: c.w, height: c.h,
          borderRadius: 2,
          background: c.color,
          transform: `rotate(${c.rotate}deg)`,
          opacity: 0.7,
        }} />
      ))}

      {/* Blue check */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        width: 24, height: 24, borderRadius: '50%', background: '#2563EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={12} color="#fff" strokeWidth={2.5} />
      </div>

      {/* Title */}
      <div style={{
        fontSize: 17, fontWeight: 800, color: '#2563EB',
        textAlign: 'center', marginBottom: 18,
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        ¡Conectado!
      </div>

      {/* Avatars */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 12 }}>
        {/* Cafe Patio */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '2.5px solid #fff',
            boxShadow: '0 2px 12px rgba(0,0,0,.14)',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img src={COFFEE_IMG} alt="Cafe Patio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Cafe Patio</span>
          <span style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: -4 }}>Cafetería</span>
        </div>

        {/* × */}
        <span style={{ fontSize: 18, color: '#CBD5E1', marginTop: 20 }}>×</span>

        {/* Naturaé */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: '#F5EFE6',
            border: '2.5px solid #fff',
            boxShadow: '0 2px 12px rgba(0,0,0,.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C14 4 6 9 6 16a8 8 0 0016 0C22 9 14 4 14 4z" fill="#C8A882" opacity=".6"/>
              <path d="M14 8C14 8 9 12 9 17a5 5 0 0010 0C19 12 14 8 14 8z" fill="#A07850" opacity=".5"/>
              <circle cx="14" cy="17" r="3" fill="#8B6340" opacity=".4"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Naturaé</span>
          <span style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: -4 }}>Cosmética natural</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid #F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>Nueva alianza activa</span>
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '1.5px solid #CBD5E1',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: '#94A3B8', fontWeight: 700,
        }}>i</span>
      </div>
    </motion.div>
  )
}
