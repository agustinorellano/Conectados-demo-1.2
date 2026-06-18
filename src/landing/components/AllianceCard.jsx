import { motion } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { floatAnim } from './tokens'

function BizAvatar({ emoji, bg, name, cat }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
        boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        border: '3px solid #fff',
      }}>
        {emoji}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{name}</span>
      <span style={{ fontSize: 10, color: '#94A3B8' }}>{cat}</span>
    </div>
  )
}

export default function AllianceCard() {
  const { animate, transition } = floatAnim(5, 0)
  return (
    <motion.div
      animate={animate}
      transition={transition}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 28px rgba(0,0,0,.07)',
        padding: '20px 24px',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BizAvatar
          emoji="☕"
          bg="radial-gradient(circle at 40% 35%,#5C3317,#2C1508)"
          name="Cafe Patio"
          cat="Cafetería"
        />

        {/* Dotted connector */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 64, padding: '0 4px' }}>
          <div style={{
            position: 'absolute', inset: '-8px 0',
            backgroundImage: 'radial-gradient(circle,#BFDBFE 1.5px,transparent 1.5px)',
            backgroundSize: '9px 9px',
            backgroundPosition: 'center',
            opacity: 0.8,
          }} />
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#fff', border: '2px solid #BFDBFE',
            boxShadow: '0 2px 10px rgba(37,99,235,.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1, flexShrink: 0,
          }}>
            <Link2 size={14} color="#2563EB" strokeWidth={2.5} />
          </div>
        </div>

        <BizAvatar
          emoji="🌿"
          bg="radial-gradient(circle at 50% 40%,#D8CCBA,#B0A088)"
          name="Naturaé"
          cat="Cosmética natural"
        />
      </div>
    </motion.div>
  )
}
