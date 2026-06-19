import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, FileText, Image, Mic, Paperclip, Presentation, Send, Smile, Square, X } from 'lucide-react';

const ATTACH_OPTIONS = [
  { key: 'pdf',      label: 'PDF',          icon: FileText,     color: '#EF4444' },
  { key: 'image',    label: 'Imagen',        icon: Image,        color: '#3B82F6' },
  { key: 'doc',      label: 'Presentación',  icon: Presentation, color: '#F59E0B' },
  { key: 'proposal', label: 'Propuesta',     icon: FileText,     color: '#8B5CF6' },
];

/* ── Format seconds as m:ss ── */
function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ── Waveform bars (animated while recording) ── */
function RecordingWave() {
  const BARS = 20;
  return (
    <div className="flex flex-1 items-center justify-center gap-[2px]">
      {Array.from({ length: BARS }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2.5px] rounded-full bg-red-400"
          animate={{ height: ['4px', `${8 + Math.random() * 16}px`, '4px'] }}
          transition={{ duration: 0.5 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}

function ProposalInput({ onChange, onSend, onSendAudio, value }) {
  const { t } = useTheme();
  const [inputValue,   setInputValue]   = useState(value || '');
  const [showAttach,   setShowAttach]   = useState(false);

  /* ── Recording state ── */
  const [recording,    setRecording]    = useState(false);
  const [recSeconds,   setRecSeconds]   = useState(0);
  const [micError,     setMicError]     = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const streamRef        = useRef(null);

  /* Cleanup on unmount */
  useEffect(() => () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  /* ── Start recording ── */
  const startRecording = async () => {
    setMicError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const src  = URL.createObjectURL(blob);
        const secs = recSeconds;
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        onSendAudio?.({ src, duration: fmtTime(secs), blob });
        setRecSeconds(0);
        setRecording(false);
      };

      mr.start(100);
      setRecording(true);
      setRecSeconds(0);

      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch {
      setMicError(true);
      setTimeout(() => setMicError(false), 3000);
    }
  };

  /* ── Stop and send ── */
  const stopAndSend = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  /* ── Cancel recording ── */
  const cancelRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current?.stop();
    chunksRef.current = [];
    // Override onstop to discard
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {};
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setRecSeconds(0);
    setRecording(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.();
    setInputValue('');
    onChange?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const hasText = inputValue.trim().length > 0;

  return (
    <div className="shrink-0 px-4 pt-3 pb-4"
      style={{ borderTop: `1px solid ${t.panelBorder}`, background: t.panelBg, transition: 'background 0.3s ease' }}>

      {/* ── Mic permission error ── */}
      <AnimatePresence>
        {micError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-2 rounded-[10px] px-3 py-2 text-[12px] font-semibold text-red-400"
            style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
            No se pudo acceder al micrófono. Verificá los permisos.
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── RECORDING UI ── */}
      <AnimatePresence mode="wait">
        {recording ? (
          <motion.div key="recording"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-3">

            {/* Cancel */}
            <button type="button" onClick={cancelRecording}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <X className="h-4 w-4 text-red-400" />
            </button>

            {/* Timer */}
            <span className="shrink-0 font-['Space_Grotesk'] text-[13px] font-bold tabular-nums text-red-400">
              {fmtTime(recSeconds)}
            </span>

            {/* Animated waveform */}
            <RecordingWave />

            {/* Send (stop + send) */}
            <motion.button type="button" onClick={stopAndSend}
              whileTap={{ scale: 0.88 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}>
              <Send className="h-4 w-4 text-white" />
            </motion.button>
          </motion.div>

        ) : (
          <motion.div key="input"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">

            {/* Attach */}
            <div className="relative">
              <button type="button" onClick={() => setShowAttach(p => !p)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                {showAttach
                  ? <X className="h-4 w-4 text-white/50" />
                  : <Paperclip className="h-4 w-4 text-white/40" />}
              </button>

              <AnimatePresence>
                {showAttach && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.92 }}
                    transition={{ duration: 0.14 }}
                    className="absolute bottom-14 left-0 z-20 overflow-hidden rounded-[16px] py-1.5"
                    style={{
                      background: 'rgba(18,26,54,0.98)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                      width: '168px',
                    }}>
                    {ATTACH_OPTIONS.map(({ key, label, icon: Icon, color }) => (
                      <button key={key} type="button" onClick={() => setShowAttach(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                          style={{ background: `${color}20` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color }} />
                        </div>
                        <span className="text-[13px] font-medium text-white/75">{label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text field */}
            <input
              className="h-11 flex-1 rounded-[22px] px-4 text-[14px] text-white/90 outline-none placeholder:text-white/25"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              value={inputValue}
            />

            {/* Emoji */}
            <button type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <Smile className="h-4 w-4 text-white/40" />
            </button>

            {/* Mic → starts recording / Send → sends text */}
            {hasText ? (
              <motion.button type="button" onClick={handleSend}
                initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                whileTap={{ scale: 0.88 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}>
                <ArrowUp className="h-4 w-4 text-white" />
              </motion.button>
            ) : (
              <motion.button type="button" onClick={startRecording}
                whileTap={{ scale: 0.88 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-90"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <Mic className="h-4 w-4 text-white/40" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProposalInput;
