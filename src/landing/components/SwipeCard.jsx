import { motion } from 'framer-motion'

const COFFEE_IMG = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80'
const BEAUTY_IMG = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80'

function Half({ side }) {
  const isLeft = side === 'left'
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Photo */}
      <img
        src={isLeft ? COFFEE_IMG : BEAUTY_IMG}
        alt={isLeft ? 'Cafe Patio' : 'Naturaé'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isLeft
          ? 'linear-gradient(to top,rgba(0,0,0,.82) 0%,rgba(0,0,0,.08) 55%,transparent 100%)'
          : 'linear-gradient(to top,rgba(0,0,0,.30) 0%,transparent 55%)',
      }} />
      {/* Info — left only */}
      {isLeft && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 11, zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
            {['9 km', 'Cafetería'].map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,.28)', borderRadius: 999,
                padding: '2px 8px', fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,.92)',
              }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>Cafe Patio</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>Cafetería de especialidad</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
            {['Espacio físico', 'Audiencia local'].map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,.14)', borderRadius: 5,
                padding: '2px 7px', fontSize: 7, color: 'rgba(255,255,255,.78)', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SwipeCard() {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 1.5, -0.8, 0] }}
      transition={{ duration: 0.8, delay: 1.8, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: 134, left: -50,
        width: 236, height: 274,
        borderRadius: 20,
        overflow: 'hidden',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: '0 24px 60px rgba(0,0,0,.22), 0 8px 20px rgba(0,0,0,.14)',
      }}
    >
      <Half side="left" />
      <Half side="right" />
    </motion.div>
  )
}
