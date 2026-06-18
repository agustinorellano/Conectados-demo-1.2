import { motion } from 'framer-motion'
import { Link2, Bell, Menu, ArrowRight } from 'lucide-react'
import { floatAnim } from './tokens'
import SwipeCard from './SwipeCard'

function ActionBtn({ children, color, size = 38, bg = '#fff', border = '#E2E8F0', shadow = true }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, border: `1.5px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, cursor: 'pointer', color,
        boxShadow: shadow ? '0 2px 10px rgba(0,0,0,.05)' : 'none',
        flexShrink: 0,
      }}
    >
      {children}
    </motion.button>
  )
}

export default function PhoneMockup() {
  const { animate, transition } = floatAnim(5.5, 0.4)

  return (
    <motion.div animate={animate} transition={transition} style={{ position: 'relative', flexShrink: 0 }}>

      {/* iPhone frame */}
      <div style={{
        width: 264,
        background: '#111',
        borderRadius: 46,
        padding: 11,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 0 0 1px rgba(255,255,255,.07), 0 0 0 10px #1c1c1e, 0 0 0 12px #2e2e2e, 0 36px 90px rgba(0,0,0,.28), 0 12px 32px rgba(0,0,0,.18)',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 17, left: '50%', transform: 'translateX(-50%)',
          width: 86, height: 23, background: '#111', borderRadius: 12, zIndex: 5,
        }} />

        {/* Screen */}
        <div style={{ borderRadius: 37, background: '#F8FAFC', overflow: 'hidden', position: 'relative', height: 524 }}>

          {/* App header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '50px 14px 9px', background: '#fff', borderBottom: '1px solid #F1F5F9',
          }}>
            <Menu size={14} color="#94A3B8" strokeWidth={2} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link2 size={11} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>conectados</span>
            </div>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={12} color="#64748B" strokeWidth={2} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '7px 10px', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '7px', borderRadius: 10, background: '#0F172A', fontSize: 11, fontWeight: 600, color: '#fff' }}>Para ti</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '7px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Guardados</div>
          </div>

          {/* Action buttons — gradient fade from bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '12px 14px 22px',
            background: 'linear-gradient(to bottom,transparent 0%,#fff 35%)',
          }}>
            <ActionBtn color="#F59E0B">↺</ActionBtn>
            <ActionBtn color="#EF4444" size={36}><span style={{ fontSize: 12 }}>✕</span></ActionBtn>
            <ActionBtn color="#F59E0B" size={36}><span style={{ fontSize: 12 }}>☆</span></ActionBtn>
            <ActionBtn color="#EC4899" size={36}><span style={{ fontSize: 13 }}>♡</span></ActionBtn>
            <ActionBtn
              size={52}
              bg="#2563EB"
              color="#fff"
              border="transparent"
              shadow={false}
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
              >
                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
              </motion.div>
            </ActionBtn>
          </div>

        </div>
      </div>

      {/* Swipe card — protrudes to the left */}
      <SwipeCard />

    </motion.div>
  )
}
