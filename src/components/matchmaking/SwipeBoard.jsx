import {
  Bookmark,
  Heart,
  Search,
  X
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import CompanyDetailModal from './CompanyDetailModal';
import { calculateMatchScore, shouldRevealCompany, willCreateMatch } from '../../utils/matchmaking';

const SWIPE_THRESHOLD_X = 110;

const actionButtons = [
  { key: 'skip', icon: X, tone: 'bg-rose-50 text-rose-500 ring-rose-100', size: 'h-14 w-14' },
  { key: 'save', icon: Bookmark, tone: 'bg-amber-50 text-amber-500 ring-amber-100', size: 'h-12 w-12' },
  { key: 'like', icon: Heart, tone: 'bg-emerald-50 text-emerald-500 ring-emerald-100', size: 'h-14 w-14' },
  { key: 'profile', icon: Search, tone: 'bg-blue-50 text-[#1871D8] ring-blue-100', size: 'h-12 w-12' }
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
  const [viewingCompany, setViewingCompany] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const nextScale = useTransform(x, [-180, 0, 180], [0.95, 0.97, 0.95]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -110], [0, 1]);

  const activeCompany = deck[activeIndex];
  const nextCompany = deck[activeIndex + 1];
  const matchLimitReached = userPlan === 'starter' && dailyMatchCount >= 10;

  const showFlash = (message) => {
    setFlashMessage(message);
    window.clearTimeout(showFlash.timeoutId);
    showFlash.timeoutId = window.setTimeout(() => setFlashMessage(null), 1300);
  };

  const queueNextCompany = (state) => {
    if (!activeCompany) return;
    setHistory((current) => [...current, { index: activeIndex }]);
    setExitState(state);
    window.setTimeout(() => {
      x.set(0);
      y.set(0);
      setActiveIndex((current) => current + 1);
    }, 180);
  };

  const handleSkip = () => {
    showFlash('Descartada.');
    queueNextCompany({ x: -180, y: 18 });
  };

  const handleLike = () => {
    if (!activeCompany) return;
    if (matchLimitReached) {
      showFlash('Limite diario alcanzado.');
      return;
    }
    if (willCreateMatch(activeCompany, activeCompany.score)) {
      onMatch?.(activeCompany);
      showFlash(`Match con ${activeCompany.name}!`);
    } else {
      showFlash('Like enviado.');
    }
    queueNextCompany({ x: 180, y: -18 });
  };

  const handleSave = () => {
    if (!activeCompany) return;
    showFlash(`${activeCompany.name} guardada.`);
  };

  const handleViewProfile = () => {
    if (!activeCompany) return;
    setViewingCompany(activeCompany);
  };

  const handleAction = (actionKey) => {
    switch (actionKey) {
      case 'skip': handleSkip(); break;
      case 'save': handleSave(); break;
      case 'like': handleLike(); break;
      case 'profile': handleViewProfile(); break;
      default: break;
    }
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD_X) {
      handleSkip();
      return;
    }
    if (info.offset.x > SWIPE_THRESHOLD_X) {
      handleLike();
      return;
    }
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[20px] bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm ring-1 ring-inset ring-slate-200">
          <div className="relative mx-auto min-h-[600px] max-w-md">
            {nextCompany ? (
              <motion.div
                className="absolute inset-x-4 top-4 z-10 opacity-50"
                style={{ scale: nextScale }}
              >
                <CompanyCard company={nextCompany} />
              </motion.div>
            ) : null}

            <AnimatePresence initial={false} mode="wait">
              {activeCompany ? (
                <motion.div
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  exit={{ opacity: 0, x: exitState.x, y: exitState.y, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  key={activeCompany.id}
                  onDragEnd={handleDragEnd}
                  style={{ x, y, rotate }}
                  transition={{ duration: 0.2 }}
                >
                  {/* LIKE overlay */}
                  <motion.div
                    className="pointer-events-none absolute left-5 top-5 z-30 rotate-[-16deg]"
                    style={{ opacity: likeOpacity }}
                  >
                    <div className="rounded-xl border-[3px] border-[#22c55e] bg-[#22c55e]/10 px-4 py-1.5 backdrop-blur-sm">
                      <span className="font-['Space_Grotesk'] text-2xl font-black tracking-wider text-[#22c55e]">
                        LIKE
                      </span>
                    </div>
                  </motion.div>

                  {/* NOPE overlay */}
                  <motion.div
                    className="pointer-events-none absolute right-5 top-5 z-30 rotate-[16deg]"
                    style={{ opacity: nopeOpacity }}
                  >
                    <div className="rounded-xl border-[3px] border-rose-500 bg-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
                      <span className="font-['Space_Grotesk'] text-2xl font-black tracking-wider text-rose-500">
                        NOPE
                      </span>
                    </div>
                  </motion.div>

                  <CompanyCard company={activeCompany} />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-white p-10 text-center shadow-sm ring-1 ring-inset ring-slate-200"
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

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-5">
          {actionButtons.map((button) => {
            const Icon = button.icon;
            return (
              <motion.button
                className={`inline-flex items-center justify-center rounded-full shadow-sm ring-1 ring-inset transition-shadow hover:shadow-md ${button.tone} ${button.size}`}
                key={button.key}
                onClick={() => handleAction(button.key)}
                type="button"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon className="h-5 w-5" />
              </motion.button>
            );
          })}
        </div>

        {flashMessage ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-sm rounded-[18px] bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 8 }}
          >
            {flashMessage}
          </motion.div>
        ) : null}

        {matchLimitReached ? (
          <div className="mx-auto max-w-md rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-center text-sm leading-6 text-amber-900">
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

      {viewingCompany && (
        <CompanyDetailModal
          company={viewingCompany}
          onClose={() => setViewingCompany(null)}
          onLike={handleLike}
        />
      )}
    </>
  );
}

export default SwipeBoard;
