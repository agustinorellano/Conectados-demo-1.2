import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link2, Tag, Percent, Users, Check } from 'lucide-react'
import { fadeUp, floatAnim } from './tokens'
import BenefitItem from './BenefitItem'
import ConnectedCard from './ConnectedCard'
import SearchingPill from './SearchingPill'
import FoundCard from './FoundCard'

const BENEFITS = [
  { icon: <Tag size={18} color="#2563EB" strokeWidth={2} />, text: 'Beneficios exclusivos' },
  { icon: <Percent size={18} color="#2563EB" strokeWidth={2} />, text: 'Descuentos especiales' },
  { icon: <Users size={18} color="#2563EB" strokeWidth={2} />, text: 'Más valor para tu negocio' },
]

export default function HeroSection() {
  const { animate: floatA, transition: floatT } = floatAnim(5, 0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      background: 'linear-gradient(160deg,#F0F4FF 0%,#EEF4FF 55%,#F5F7FF 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '0 24px 48px' : '0 48px 60px',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      overflowX: 'hidden',
    }}>

      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle,#BFDBFE 1px,transparent 1px)',
        backgroundSize: '30px 30px', opacity: 0.2,
      }} />

      {/* Logo — hidden on mobile (navbar already shows it) */}
      {!isMobile && (
        <motion.div {...fadeUp(0)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingTop: 28, position: 'relative', zIndex: 2,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Link2 size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
            conectados
          </span>
        </motion.div>
      )}

      {/* Layout: stacked on mobile, 2-col on desktop */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.25fr',
        gap: isMobile ? 32 : 48,
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        paddingTop: isMobile ? 96 : 28,
        position: 'relative', zIndex: 1,
      }}>

        {/* LEFT — copy + cards */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.h1 {...fadeUp(0.06)} style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? 52 : 72,
            fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', color: '#0F172A',
            margin: '0 0 4px',
          }}>Deslizá.</motion.h1>

          <motion.h1 {...fadeUp(0.13)} style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? 52 : 72,
            fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', color: '#2563EB',
            margin: '0 0 20px',
          }}>Conectá.</motion.h1>

          <motion.p {...fadeUp(0.20)} style={{
            fontSize: isMobile ? 15 : 16,
            lineHeight: 1.6, color: '#475569',
            margin: '0 0 28px',
            maxWidth: isMobile ? '100%' : 340,
          }}>
            Encontrá alianzas que potencian tu negocio y generan más valor para tus clientes.
          </motion.p>

          {/* Searching → Found flow */}
          <motion.div {...fadeUp(0.27)} style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Tu próximo match
            </span>
          </motion.div>

          <motion.div {...fadeUp(0.34)} style={{ marginBottom: 10, maxWidth: 300 }}>
            <SearchingPill />
          </motion.div>

          <motion.div {...fadeUp(0.38)} style={{
            width: 1, height: 28, marginLeft: 22,
            borderLeft: '2px dashed #BFDBFE', marginBottom: 10,
          }} />

          <motion.div {...fadeUp(0.44)} style={{ maxWidth: 300 }}>
            <FoundCard />
          </motion.div>

          {/* Benefits */}
          <motion.div {...fadeUp(0.52)} style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? 10 : 16,
            marginTop: 28,
          }}>
            {BENEFITS.map(b => <BenefitItem key={b.text} icon={b.icon} text={b.text} />)}
          </motion.div>
        </div>

        {/* RIGHT — phone mockup (hidden on mobile, shown below copy) */}
        {!isMobile && (
          <motion.div {...fadeUp(0.10)} style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img
              src="/mockup-swipe.png"
              alt="App preview"
              style={{
                width: '100%',
                maxWidth: 440,
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 24px 48px rgba(37,99,235,.15))',
              }}
            />

            {/* Swipe gesture */}
            <motion.div
              style={{
                position: 'absolute', bottom: '18%', left: '50%',
                translateX: '-50%', zIndex: 20,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <motion.div
                animate={{ x: [0, 36, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}
              >
                <div style={{ width: 56, height: 6, borderRadius: 999, background: 'linear-gradient(to right, transparent, #2563EB)' }} />
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11h14M13 5l6 6-6 6" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <motion.div
                animate={{ x: [0, 36, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <img src="/hand-cursor.png" alt="" style={{ width: 56, height: 'auto', display: 'block' }} />
              </motion.div>
            </motion.div>

            {/* ConnectedCard floating */}
            <motion.div
              animate={floatA}
              transition={floatT}
              style={{
                position: 'absolute', top: '15%', right: '-4%',
                width: 240, zIndex: 10,
                filter: 'drop-shadow(0 12px 32px rgba(37,99,235,.18))',
              }}
            >
              <ConnectedCard />
            </motion.div>
          </motion.div>
        )}

        {/* Mobile-only: compact phone image below copy */}
        {isMobile && (
          <motion.div {...fadeUp(0.55)} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/mockup-swipe.png"
              alt="App preview"
              style={{
                width: '80%',
                maxWidth: 280,
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 16px 32px rgba(37,99,235,.15))',
              }}
            />
          </motion.div>
        )}

      </div>
    </section>
  )
}
