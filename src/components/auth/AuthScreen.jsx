import { useState } from 'react';

function AuthScreen({ onContinue }) {
  const [mode, setMode] = useState('login');

  return (
    <section className="h-screen overflow-y-auto bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] px-4 py-8 sm:px-6 sm:py-10 [scrollbar-width:none]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-5 lg:grid-cols-[1.1fr_420px]">
        <article className="flex rounded-[28px] border border-[var(--stroke)] bg-white/90 p-8 shadow-sm sm:p-10">
          <div className="my-auto max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1871D8]">
              SaaS premium para crecimiento compartido
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[var(--text)]">
              Convertir compatibilidad en alianzas rentables.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              Conectados combina analitica, ejecucion y merchandising inteligente
              para conectar empresas que realmente pueden generar valor juntas.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F6F7F9] p-5">
                <strong className="text-3xl text-[var(--text)]">+84%</strong>
                <span className="mt-2 block text-sm text-[var(--muted)]">
                  mejor visibilidad de oportunidades
                </span>
              </div>
              <div className="rounded-2xl bg-[#F6F7F9] p-5">
                <strong className="text-3xl text-[var(--text)]">+27%</strong>
                <span className="mt-2 block text-sm text-[var(--muted)]">
                  lift promedio en propuestas co-branded
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="flex rounded-[28px] border border-[var(--stroke)] bg-white p-6 shadow-sm sm:p-8">
          <div className="my-auto w-full">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl">
                <img src="/logo.svg" alt="Conectados" className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">Conectados</h3>
                <p className="text-sm text-[var(--muted)]">Ingreso seguro a la plataforma</p>
              </div>
            </div>

            <div className="mb-6 inline-grid w-full grid-cols-2 rounded-2xl bg-[#F6F7F9] p-1">
              <button
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  mode === 'login'
                    ? 'bg-white text-[var(--text)] shadow-sm'
                    : 'text-[var(--muted)]'
                }`}
                onClick={() => setMode('login')}
                type="button"
              >
                Ingresar
              </button>
              <button
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  mode === 'register'
                    ? 'bg-white text-[var(--text)] shadow-sm'
                    : 'text-[var(--muted)]'
                }`}
                onClick={() => setMode('register')}
                type="button"
              >
                Crear cuenta
              </button>
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
                  Empresa
                  <input defaultValue="Top White" placeholder="Nombre comercial" />
                </label>
              )}
              <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
                Email
                <input defaultValue="equipo@topwhite.com" placeholder="tu@empresa.com" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
                Password
                <input defaultValue="******" placeholder="Tu password" type="password" />
              </label>
            </div>

            <button
              className="primary-button mt-6 w-full"
              onClick={() => onContinue(mode === 'register')}
              type="button"
            >
              {mode === 'login' ? 'Entrar a la plataforma' : 'Crear espacio de trabajo'}
            </button>

            <p className="mt-4 text-center text-sm text-[var(--muted)]">
              Demo UI. Los datos estan simulados para mostrar la experiencia.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default AuthScreen;
