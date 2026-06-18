import { motion } from 'framer-motion'
import { Link2, Tag, Percent, Users, Check } from 'lucide-react'
import { fadeUp } from './tokens'
import BenefitItem from './BenefitItem'
import AllianceCard from './AllianceCard'
import PhoneMockup from './PhoneMockup'
import ConnectedCard from './ConnectedCard'
import SearchingPill from './SearchingPill'
import FoundCard from './FoundCard'

const BENEFITS = [
  { icon: <Tag size={18} color="#2563EB" strokeWidth={2} />, text: 'Beneficios exclusivos' },
  { icon: <Percent size={18} color="#2563EB" strokeWidth={2} />, text: 'Descuentos especiales' },
  { icon: <Users size={18} color="#2563EB" strokeWidth={2} />, text: 'Más valor para tu negocio' },
]

export default function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(160deg,#F0F4FF 0%,#EEF4FF 55%,#F5F7FF 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 48px 60px',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle,#BFDBFE 1px,transparent 1px)',
        backgroundSize: '30px 30px', opacity: 0.2,
      }} />

      {/* Logo */}
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

      {/* 3-column grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr 0.9fr',
        gap: 40,
        alignItems: 'center',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        paddingTop: 28,
        position: 'relative', zIndex: 1,
      }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.h1 {...fadeUp(0.06)} style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 76, fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', color: '#0F172A',
            margin: '0 0 4px',
          }}>Deslizá.</motion.h1>

          <motion.h1 {...fadeUp(0.13)} style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 76, fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', color: '#2563EB',
            margin: '0 0 22px',
          }}>Conectá.</motion.h1>

          <motion.p {...fadeUp(0.20)} style={{
            fontSize: 16, lineHeight: 1.6, color: '#475569',
            margin: '0 0 24px', maxWidth: 340,
          }}>
            Encontrá alianzas que potencian tu negocio y generan más valor para tus clientes.
          </motion.p>

          <motion.div {...fadeUp(0.33)} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2563EB', borderRadius: 999, padding: '10px 20px',
              boxShadow: '0 6px 22px rgba(37,99,235,.30)',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(255,255,255,.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={10} color="#fff" strokeWidth={3} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Alianza conectada</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.40)} style={{ display: 'flex', gap: 16 }}>
            {BENEFITS.map(b => <BenefitItem key={b.text} icon={b.icon} text={b.text} />)}
          </motion.div>
        </div>

        {/* CENTER — hero image */}
        <motion.div {...fadeUp(0.10)} style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          position: 'relative',
        }}>
          <img
            src="/mockup-swipe.png"
            alt="App preview"
            style={{
              width: '100%',
              maxWidth: 500,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.10))',
            }}
          />
        </motion.div>

        {/* RIGHT — floating cards + dashed connector */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          gap: 0, paddingTop: 16,
        }}>
          <motion.div {...fadeUp(0.18)} style={{ width: '100%' }}>
            <ConnectedCard />
          </motion.div>

          {/* Dashed vertical line */}
          <motion.div {...fadeUp(0.30)} style={{
            width: 1, height: 36, marginLeft: 28,
            borderLeft: '2px dashed #BFDBFE',
          }} />

          <motion.div {...fadeUp(0.36)} style={{ width: '100%' }}>
            <SearchingPill />
          </motion.div>

          {/* Dashed vertical line */}
          <motion.div {...fadeUp(0.44)} style={{
            width: 1, height: 36, marginLeft: 28,
            borderLeft: '2px dashed #BFDBFE',
          }} />

          <motion.div {...fadeUp(0.50)} style={{ width: '100%' }}>
            <FoundCard />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
