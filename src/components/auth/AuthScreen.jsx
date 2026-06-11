import { useState } from 'react';

function AuthScreen({ onContinue }) {
  const [mode, setMode] = useState('login');

  return (
    <section className="flex h-screen items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] px-4 py-8 [scrollbar-width:none]">
        <article className="w-full max-w-[420px] rounded-[28px] border border-[var(--stroke)] bg-white p-6 shadow-sm sm:p-8">
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
    </section>
  );
}

export default AuthScreen;
