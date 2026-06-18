import { motion } from 'framer-motion'
import { Link2 } from 'lucide-react'

const ARC_DOTS = Array.from({ length: 8 }, (_, i) => {
  const angle = -60 + i * 18 // arc from -60° to +76°
  const rad = (angle * Math.PI) / 180
  const r = 13
  return { x: r * Math.cos(rad), y: r * Math.sin(rad), delay: i * 0.1 }
})

export default function SearchingPill() {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        background: '#1E3A8A',
        borderRadius: 18,
        padding: '12px 20px 12px 12px',
        boxShadow: '0 8px 28px rgba(37,99,235,.35)',
        position: 'relative',
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: 'rgba(255,255,255,.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Link2 size={18} color="#93C5FD" strokeWidth={2.5} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          Buscando alianzas...
        </div>
        <div style={{ fontSize: 11, color: '#93C5FD', marginTop: 2, lineHeight: 1.3 }}>
          Analizando compatibilidad
        </div>
      </div>

      {/* Arc spinner dots */}
      <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
        {ARC_DOTS.map((dot, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, delay: dot.delay }}
            style={{
              position: 'absolute',
              width: 4, height: 4, borderRadius: '50%',
              background: '#93C5FD',
              top: '50%', left: '50%',
              transform: `translate(calc(-50% + ${dot.x}px), calc(-50% + ${dot.y}px))`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
