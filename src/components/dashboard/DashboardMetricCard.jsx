import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import useCountUp from '../../utils/useCountUp';

const toneMap = {
  blue: 'from-blue-50 to-white ring-blue-100',
  emerald: 'from-emerald-50 to-white ring-emerald-100',
  amber: 'from-amber-50 to-white ring-amber-100',
  slate: 'from-slate-100 to-white ring-slate-200'
};

const trendMap = {
  up: {
    icon: ArrowUpRight,
    className: 'text-emerald-600'
  },
  down: {
    icon: ArrowDownRight,
    className: 'text-rose-500'
  },
  neutral: {
    icon: Minus,
    className: 'text-slate-400'
  }
};

function DashboardMetricCard({ label, value, prefix = '', suffix = '', change, trend, tone = 'slate' }) {
  const toneClass = toneMap[tone] || toneMap.slate;
  const animatedValue = useCountUp(value);
  const trendConfig = trendMap[trend] || trendMap.neutral;
  const TrendIcon = trendConfig.icon;
  const formattedValue = `${prefix}${Math.round(animatedValue).toLocaleString('es-AR')}${suffix}`;

  return (
    <motion.article
      className={`rounded-[24px] bg-gradient-to-br p-4 shadow-sm ring-1 ring-inset transition duration-200 hover:scale-[1.02] hover:shadow-lg ${toneClass}`}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="font-['Inter'] text-5xl font-extrabold leading-none tracking-[-0.05em] text-[#1A1A1A]">
          {formattedValue}
        </div>
        <div className={`inline-flex items-center gap-1 text-sm font-semibold ${trendConfig.className}`}>
          <TrendIcon className="h-4 w-4" />
          {change === 0 ? '0.0%' : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
        </div>
      </div>
    </motion.article>
  );
}

export default DashboardMetricCard;
