import {
  Bookmark,
  Heart,
  RotateCcw,
  Sparkles,
  Star,
  X,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';

const SWIPE_THRESHOLD_X = 110;
const SWIPE_THRESHOLD_Y = -90;

const actionButtons = [
  { key: 'rewind', icon: RotateCcw, tone: 'bg-amber-50 text-amber-600 ring-amber-100' },
  { key: 'skip', icon: X, tone: 'bg-rose-50 text-rose-600 ring-rose-100' },
  { key: 'superLike', icon: Sparkles, tone: 'bg-blue-50 text-[#1871D8] ring-blue-100' },
  { key: 'like', icon: Heart, tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
  { key: 'boost', icon: Zap, tone: 'bg-violet-50 text-violet-600 ring-violet-100' },
  { key: 'topPicks', icon: Star, tone: 'bg-amber-50 text-yellow-600 ring-yellow-100' }
];

function SwipeBoard({ companies, dailyMatchCount, onMatch, onOpenPricing, userPlan }) {
  const deck = useMemo(
    () =>
      companies
        .map((company) => ({ ...company, score: calculateMatchScore(company) }))
        .filter((company) => shouldRevealCompany(company.score)),
    [companies]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);
  const [exitState, setExitState] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const nextScale = useTransform(x, [-180, 0, 180], [0.95, 0.97, 0.95]);

  const activeCompany = deck[activeIndex];
  const nextCompany = deck[activeIndex + 1];
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const showFlash = (message) => {
    setFlashMessage(message);
    window.clearTimeout(showFlash.timeoutId);
    showFlash.timeoutId = window.setTimeout(() => setFlashMessage(null), 1300);
  };

  const queueNextCompany = (state, actionKey) => {
    if (!activeCompany) return;

    setHistory((current) => [...current, { index: activeIndex, actionKey }]);
    setExitState(state);
    window.setTimeout(() => {
      x.set(0);
      y.set(0);
      setActiveIndex((current) => current + 1);
    }, 180);
  };

  const handleSkip = () => {
    showFlash('Descartada.');
    queueNextCompany({ x: -180, y: 18 }, 'skip');
  };

  const handleLike = (kind = 'like') => {
    if (!activeCompany) return;

    if (matchLimitReached) {
      showFlash('Limite diario alcanzado.');
      return;
    }

    if (willCreateMatch(activeCompany, activeCompany.score)) {
      onMatch({
        ...activeCompany,
        matchKind: kind
      });
    }

    showFlash(kind === 'superLike' ? 'Super Like enviado.' : 'Like enviado.');
    queueNextCompany(
      kind === 'superLike' ? { x: 0, y: -160 } : { x: 180, y: 12 },
      kind
    );
  };

  const handleRewind = () => {
    const previous = history[history.length - 1];
    if (!previous) {
      showFlash('No hay perfil para recuperar.');
      return;
    }

    setHistory((current) => current.slice(0, -1));
    x.set(0);
    y.set(0);
    setExitState({ x: 0, y: 0 });
    setActiveIndex(previous.index);
    showFlash('Perfil recuperado.');
  };

  const handleBoost = () => {
    if (!activeCompany) return;
    showFlash(`${activeCompany.name} recibió boost.`);
  };

  const handleTopPicks = () => {
    if (!activeCompany) return;
    showFlash(`${activeCompany.name} marcada como top pick.`);
  };

  const handleAction = (actionKey) => {
    switch (actionKey) {
      case 'rewind':
        handleRewind();
        break;
      case 'skip':
        handleSkip();
        break;
      case 'superLike':
        handleLike('superLike');
        break;
      case 'like':
        handleLike('like');
        break;
      case 'boost':
        handleBoost();
        break;
      case 'topPicks':
        handleTopPicks();
        break;
      default:
        break;
    }
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y < SWIPE_THRESHOLD_Y) {
      handleLike('superLike');
      return;
    }

    if (info.offset.x < -SWIPE_THRESHOLD_X) {
      handleSkip();
      return;
    }

    if (info.offset.x > SWIPE_THRESHOLD_X) {
      handleLike('like');
      return;
    }

    x.set(0);
    y.set(0);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm ring-1 ring-inset ring-slate-200">
        <div className="relative mx-auto min-h-[640px] max-w-xl">
          {nextCompany ? (
            <motion.div
              className="absolute inset-x-4 top-5 z-10 opacity-50"
              style={{ scale: nextScale }}
            >
              <CompanyCard company={nextCompany} score={nextCompany.score} />
            </motion.div>
          ) : null}

          <AnimatePresence initial={false} mode="wait">
            {activeCompany ? (
              <motion.div
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                className="absolute inset-0 z-20"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                exit={{ opacity: 0, x: exitState.x, y: exitState.y }}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                key={activeCompany.id}
                onDragEnd={handleDragEnd}
                style={{ x, y, rotate }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
              >
                <CompanyCard company={activeCompany} score={activeCompany.score} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-inset ring-slate-200"
                initial={{ opacity: 0 }}
                key="empty"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#1871D8]">
                    Deck completo
                  </p>
                  <h3 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                    No hay mas empresas por evaluar
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              className={`inline-flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-inset transition duration-200 hover:scale-110 active:scale-95 ${button.tone}`}
              key={button.key}
              onClick={() => handleAction(button.key)}
              type="button"
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {flashMessage ? (
        <div className="mx-auto max-w-sm rounded-[18px] bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-sm">
          {flashMessage}
        </div>
      ) : null}

      {matchLimitReached ? (
        <div className="mx-auto max-w-md rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-center text-sm leading-6 text-amber-900">
          Llegaste al limite diario del plan Starter.
          <button
            className="mt-3 inline-flex rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
            onClick={onOpenPricing}
            type="button"
          >
            Ver planes
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default SwipeBoard;
