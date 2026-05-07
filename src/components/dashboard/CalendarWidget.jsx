import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { useMemo, useState } from 'react';

const DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const COMPANY_COLORS = {
  'BF': { bg: 'bg-emerald-100', text: 'text-emerald-700', event: 'bg-emerald-500' },
  'SN': { bg: 'bg-blue-100',    text: 'text-blue-700',    event: 'bg-blue-500'    },
  'LB': { bg: 'bg-pink-100',    text: 'text-pink-700',    event: 'bg-pink-500'    },
  'CW': { bg: 'bg-violet-100',  text: 'text-violet-700',  event: 'bg-violet-500'  },
  'DC': { bg: 'bg-amber-100',   text: 'text-amber-700',   event: 'bg-amber-500'   },
};

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function todayIso() {
  const now = new Date();
  return isoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

/* ── Shared meeting card ─────────────────────────────────────── */
function MeetingCard({ meeting, onToggleDone }) {
  const colors = COMPANY_COLORS[meeting.companyInitials] || COMPANY_COLORS['BF'];
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 rounded-[16px] bg-slate-50 px-3 py-3 ring-1 ring-inset ring-slate-200 transition-opacity ${
        meeting.done ? 'opacity-50' : ''
      }`}
      initial={{ opacity: 0, y: 6 }}
      layout
      transition={{ duration: 0.18 }}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-xs font-bold ${colors.bg} ${colors.text}`}
      >
        {meeting.companyInitials}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold leading-snug transition-all ${
            meeting.done ? 'text-slate-400 line-through' : 'text-[#1A1A1A]'
          }`}
        >
          {meeting.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Video className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] text-slate-400">
            {meeting.time} — {meeting.endTime}
          </span>
        </div>
      </div>

      {/* Done toggle */}
      <button
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          meeting.done
            ? 'border-emerald-400 bg-emerald-400 text-white'
            : 'border-slate-300 bg-white text-transparent hover:border-emerald-400'
        }`}
        onClick={() => onToggleDone(meeting.id)}
        title={meeting.done ? 'Marcar como pendiente' : 'Marcar como realizada'}
        type="button"
      >
        <Check className="h-3 w-3" />
      </button>
    </motion.div>
  );
}

/* ── Day view ─────────────────────────────────────────────────── */
function DayView({ selectedDate, meetings, onToggleDone }) {
  const dayMeetings = meetings.filter((m) => m.date === selectedDate);
  const { day, month } = parseDate(selectedDate);

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-500">
        {day} de {MONTHS_ES[month]}
      </p>
      {dayMeetings.length === 0 ? (
        <p className="rounded-[16px] bg-slate-50 px-4 py-6 text-center text-sm text-slate-400 ring-1 ring-inset ring-slate-200">
          Sin reuniones para este día
        </p>
      ) : (
        <div className="space-y-2">
          {dayMeetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} onToggleDone={onToggleDone} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Week view ────────────────────────────────────────────────── */
function WeekView({ selectedDate, meetings, onSelect, onToggleDone }) {
  const { year, month, day } = parseDate(selectedDate);
  // Find Monday of current week
  const d = new Date(year, month, day);
  const dow = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dow + 6) % 7));

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const iso = isoDate(date.getFullYear(), date.getMonth(), date.getDate());
    return { iso, dayNum: date.getDate(), dayLabel: DAYS_SHORT[i] };
  });

  const today = todayIso();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1">
        {week.map(({ iso, dayNum, dayLabel }) => {
          const hasEvents = meetings.some((m) => m.date === iso);
          const isToday = iso === today;
          const isSelected = iso === selectedDate;
          return (
            <button
              className={`flex flex-col items-center gap-1 rounded-[14px] py-2 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-[#141E30] text-white'
                  : isToday
                  ? 'bg-[#141E30]/10 text-[#141E30]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              key={iso}
              onClick={() => onSelect(iso)}
              type="button"
            >
              <span className="text-[10px] opacity-70">{dayLabel}</span>
              <span className="text-base font-bold">{dayNum}</span>
              {hasEvents && (
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#22c55e]'}`} />
              )}
            </button>
          );
        })}
      </div>
      <DayView meetings={meetings} onToggleDone={onToggleDone} selectedDate={selectedDate} />
    </div>
  );
}

/* ── Month view ───────────────────────────────────────────────── */
function MonthView({ year, month, selectedDate, meetings, onSelect }) {
  const today = todayIso();
  const firstDayOfMonth = new Date(year, month, 1);
  // ISO week: Monday=0 ... adjust from Sunday=0
  const startDow = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: startDow }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAYS_SHORT.map((d) => (
          <span className="text-[10px] font-semibold text-slate-400" key={d}>
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const iso = isoDate(year, month, d);
          const dayMeetings = meetings.filter((m) => m.date === iso);
          const isToday = iso === today;
          const isSelected = iso === selectedDate;

          return (
            <button
              className={`flex flex-col items-center rounded-[10px] py-1 transition ${
                isSelected
                  ? 'bg-[#141E30] text-white'
                  : isToday
                  ? 'bg-[#141E30]/10 text-[#141E30] font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              key={iso}
              onClick={() => onSelect(iso)}
              type="button"
            >
              <span className="text-xs">{d}</span>
              {/* Event dots */}
              <div className="mt-0.5 flex gap-0.5">
                {dayMeetings.slice(0, 3).map((m) => {
                  const col = COMPANY_COLORS[m.companyInitials]?.event || 'bg-emerald-500';
                  return (
                    <span
                      className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : col}`}
                      key={m.id}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main CalendarWidget ──────────────────────────────────────── */
function CalendarWidget({ meetings = [], onToggleMeeting, onScheduleMeeting }) {
  const [view, setView] = useState('mes');
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  const selectedDayMeetings = useMemo(
    () => meetings.filter((m) => m.date === selectedDate),
    [meetings, selectedDate]
  );

  const upcomingMeetings = useMemo(() => {
    const today = todayIso();
    return meetings
      .filter((m) => m.date >= today && !m.done)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 4);
  }, [meetings]);

  const views = [
    { key: 'dia', label: 'Día' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-inset ring-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1871D8]">
            Agenda
          </p>
          <h2 className="mt-1 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Calendario de Alianzas
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* View tabs */}
          <div className="inline-flex rounded-[14px] bg-slate-100 p-1">
            {views.map(({ key, label }) => (
              <button
                className={`rounded-[11px] px-3 py-1.5 text-xs font-semibold transition ${
                  view === key ? 'bg-white text-[#141E30] shadow-sm' : 'text-slate-500'
                }`}
                key={key}
                onClick={() => setView(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          {/* Month nav (only for mes/semana) */}
          {view !== 'dia' && (
            <div className="flex items-center gap-2">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                onClick={prevMonth}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[100px] text-center text-sm font-semibold text-[#1A1A1A]">
                {MONTHS_ES[calMonth]} {calYear}
              </span>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                onClick={nextMonth}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body: 2-column layout */}
      <div className="grid gap-0 xl:grid-cols-[1.6fr_1fr]">
        {/* Left: Calendar */}
        <div className="border-r border-slate-100 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              initial={{ opacity: 0, x: 12 }}
              key={view}
              transition={{ duration: 0.18 }}
            >
              {view === 'mes' && (
                <MonthView
                  meetings={meetings}
                  month={calMonth}
                  onSelect={setSelectedDate}
                  selectedDate={selectedDate}
                  year={calYear}
                />
              )}
              {view === 'semana' && (
                <WeekView
                  meetings={meetings}
                  onSelect={setSelectedDate}
                  onToggleDone={onToggleMeeting}
                  selectedDate={selectedDate}
                />
              )}
              {view === 'dia' && (
                <DayView
                  meetings={meetings}
                  onToggleDone={onToggleMeeting}
                  selectedDate={selectedDate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Selected day detail + upcoming */}
        <div className="flex flex-col gap-5 p-6">
          {/* Selected day meetings */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {selectedDate === todayIso() ? 'Hoy' : 'Día seleccionado'}
              </p>
              {selectedDayMeetings.length > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#141E30] text-[10px] font-bold text-white">
                  {selectedDayMeetings.length}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {selectedDayMeetings.length === 0 ? (
                  <p className="rounded-[14px] bg-slate-50 py-4 text-center text-xs text-slate-400 ring-1 ring-inset ring-slate-200">
                    Sin reuniones
                  </p>
                ) : (
                  selectedDayMeetings.map((m) => (
                    <MeetingCard key={m.id} meeting={m} onToggleDone={onToggleMeeting} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          {upcomingMeetings.length > 0 && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Próximas reuniones
                </p>
                <div className="space-y-2">
                  {upcomingMeetings.map((m) => {
                    const colors = COMPANY_COLORS[m.companyInitials] || COMPANY_COLORS['BF'];
                    const { day, month } = parseDate(m.date);
                    const isToday = m.date === todayIso();
                    return (
                      <button
                        className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition hover:bg-slate-50"
                        key={m.id}
                        onClick={() => setSelectedDate(m.date)}
                        type="button"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[10px] font-bold ${colors.bg} ${colors.text}`}
                        >
                          {m.companyInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#1A1A1A]">
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {isToday ? 'Hoy' : `${day} ${MONTHS_ES[month]}`} · {m.time}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CalendarWidget;
