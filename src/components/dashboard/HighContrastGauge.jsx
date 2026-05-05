import useCountUp from '../../utils/useCountUp';

const toneConfig = {
  brand: {
    start: '#007AFF',
    end: '#34C759',
    badge: 'bg-[#007AFF]/10 text-[#0A6AE8]'
  },
  critical: {
    start: '#EF4444',
    end: '#F97316',
    badge: 'bg-red-50 text-red-600'
  },
  warning: {
    start: '#F59E0B',
    end: '#FBBF24',
    badge: 'bg-amber-50 text-amber-700'
  },
  success: {
    start: '#10B981',
    end: '#34D399',
    badge: 'bg-emerald-50 text-emerald-700'
  }
};

function HighContrastGauge({
  value,
  label,
  status,
  size = 'md',
  dark = false,
  tone = 'brand'
}) {
  const animatedValue = Math.round(useCountUp(Math.max(0, Math.min(value, 100)), 800));
  const currentTone = toneConfig[tone] || toneConfig.brand;
  const dimensions =
    size === 'sm'
      ? {
          width: 176,
          height: 118,
          arcWidth: 10,
          text: 'text-[2.35rem]',
          labelTop: dark ? 'text-emerald-100/70' : 'text-slate-500',
          badge: dark ? 'bg-white/10 text-emerald-100' : currentTone.badge
        }
      : {
          width: 228,
          height: 146,
          arcWidth: 12,
          text: 'text-[3.6rem]',
          labelTop: dark ? 'text-emerald-100/70' : 'text-slate-500',
          badge: dark ? 'bg-white/10 text-emerald-100' : currentTone.badge
        };

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height - 18;
  const radius = size === 'sm' ? 58 : 74;
  const startX = centerX - radius;
  const endX = centerX + radius;
  const arcY = centerY;
  const arcPath = `M ${startX} ${arcY} A ${radius} ${radius} 0 0 1 ${endX} ${arcY}`;
  const arcLength = Math.PI * radius;
  const progressLength = (animatedValue / 100) * arcLength;
  const gradientId = `gauge-gradient-${label}-${size}-${tone}-${dark ? 'dark' : 'light'}`
    .replace(/\s+/g, '-')
    .toLowerCase();

  return (
    <div className="flex flex-col items-center">
      <p
        className={`text-center text-[0.72rem] font-medium uppercase tracking-[0.28em] ${dimensions.labelTop}`}
      >
        {label}
      </p>

      <div
        className="relative mt-2"
        style={{ height: `${dimensions.height}px`, width: `${dimensions.width}px` }}
      >
        <svg
          className="absolute inset-0"
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          width={dimensions.width}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor={currentTone.start} />
              <stop offset="100%" stopColor={currentTone.end} />
            </linearGradient>
          </defs>

          <path
            d={arcPath}
            fill="none"
            stroke={dark ? 'rgba(255,255,255,0.12)' : '#F2F2F2'}
            strokeLinecap="round"
            strokeWidth={dimensions.arcWidth}
          />
          <path
            d={arcPath}
            fill="none"
            pathLength={arcLength}
            stroke={`url(#${gradientId})`}
            strokeDasharray={`${progressLength} ${arcLength}`}
            strokeLinecap="round"
            strokeWidth={dimensions.arcWidth}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pb-3">
          <div
            className={`font-['Inter'] font-extrabold leading-none tracking-[-0.05em] ${dimensions.text} ${
              dark ? 'text-white' : 'text-[#1A1A1A]'
            }`}
          >
            {animatedValue}%
          </div>
        </div>
      </div>

      {status ? (
        <span className={`-mt-1 rounded-full px-3 py-1 text-xs font-semibold ${dimensions.badge}`}>
          {status}
        </span>
      ) : null}
    </div>
  );
}

export default HighContrastGauge;
