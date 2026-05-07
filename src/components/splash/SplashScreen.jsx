import { useEffect } from 'react';

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#141E30] px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(24,113,216,0.24),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(46,204,112,0.22),transparent_18%)]" />
      <div className="absolute h-72 w-72 rounded-full bg-white/6 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/12 bg-white/8 shadow-2xl shadow-black/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#141E30]">
            DP
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100">
          Inteligencia operativa para alianzas reales
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Data Plus</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-emerald-50/82">
          Un espacio B2B donde la ejecucion y el valor economico se encuentran.
        </p>
      </div>
    </section>
  );
}

export default SplashScreen;
