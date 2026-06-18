export default function BenefitItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', flex: 1 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: '#F1F5FF', border: '1px solid #E0E7FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.35, maxWidth: 80 }}>
        {text}
      </span>
    </div>
  )
}
