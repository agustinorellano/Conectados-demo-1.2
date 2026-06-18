import { motion } from 'framer-motion'
import { Link2, ArrowRight } from 'lucide-react'
import { floatAnim } from './tokens'

export default function FoundCard() {
  const { animate, transition } = floatAnim(4, 0.6)
  return (
    <motion.div
      animate={animate}
      transition={transition}
      style={{
        background: '#fff', borderRadius: 18,
        border: '1px solid #E2E8F0',
        padding: '14px 14px 14px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,.09)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: '#EFF6FF', border: '1px solid #BFDBFE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Link2 size={18} color="#2563EB" strokeWidth={2.5} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', marginBottom: 3 }}>
          ¡Alianza encontrada!
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-.02em', marginBottom: 2 }}>
          Cafe Patio x Naturaé
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          Descuentos, promociones y más beneficios.
        </div>
      </div>

      {/* Arrow */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#2563EB', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(37,99,235,.35)',
        }}
      >
        <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  )
}
