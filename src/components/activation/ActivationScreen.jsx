import { Camera, ImagePlus, Zap } from 'lucide-react';
import { useRef } from 'react';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

const steps = [
  {
    num: '01',
    text: 'Completamos el perfil de tu empresa con objetivos, rubro y capacidad operativa.'
  },
  {
    num: '02',
    text: 'Activamos el scoring para mostrar solo alianzas con valor económico real.'
  },
  {
    num: '03',
    text: 'Centralizamos tareas, chats y seguimiento dentro de Data Plus.'
  }
];

function ActivationScreen({ onFinish, profile, onProfileChange }) {
  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleLogoSelected = async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;
    const logoImage = await readFileAsDataUrl(file);
    onProfileChange((current) => ({ ...current, logoImage }));
  };

  const handleGallerySelected = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    if (!files.length) return;
    const gallery = await Promise.all(files.map(readFileAsDataUrl));
    onProfileChange((current) => ({
      ...current,
      gallery: [...(current.gallery || []), ...gallery].slice(0, 6)
    }));
  };

  return (
    <section className="h-screen overflow-y-auto bg-[linear-gradient(180deg,#F8F9FB_0%,#F3F5F7_100%)] px-4 py-8 sm:px-6 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1871D8]">
            Onboarding inteligente
          </p>
          <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Configuramos el motor de alianzas en tres pasos.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4A4A4A]">
            Combinamos onboarding guiado con carga real de datos para que el sistema entienda tu negocio y active matchmaking con sentido comercial.
          </p>
        </div>

        {/* 3 step cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              key={step.num}
            >
              <span className="inline-flex rounded-full bg-[#1871D8]/8 px-3 py-1 text-sm font-semibold text-[#1871D8]">
                {step.num}
              </span>
              <p className="mt-4 text-sm leading-7 text-[#1A1A1A]">{step.text}</p>
            </article>
          ))}
        </div>

        {/* Logo + Gallery */}
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1871D8]">
              Marca del comercio
            </p>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] bg-slate-100">
                {profile.logoImage ? (
                  <img
                    alt={profile.name}
                    className="h-full w-full object-cover"
                    src={profile.logoImage}
                  />
                ) : (
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#141E30]">
                    {profile.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </span>
                )}
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                onClick={() => logoInputRef.current?.click()}
                type="button"
              >
                <Camera className="h-4 w-4" />
                Subir logo
              </button>
              <input
                accept="image/*"
                className="hidden"
                onChange={handleLogoSelected}
                ref={logoInputRef}
                type="file"
              />
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1871D8]">
                  Visuales del comercio
                </p>
                <p className="mt-2 text-sm leading-7 text-[#4A4A4A]">
                  Sumá imágenes del local, equipo o merchandising.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                onClick={() => galleryInputRef.current?.click()}
                type="button"
              >
                <ImagePlus className="h-4 w-4" />
                Agregar
              </button>
              <input
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleGallerySelected}
                ref={galleryInputRef}
                type="file"
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(profile.gallery || []).slice(0, 3).map((image, index) => (
                <img
                  alt={`Visual ${index + 1}`}
                  className="h-28 w-full rounded-[22px] object-cover"
                  key={`${image}-${index}`}
                  src={image}
                />
              ))}
            </div>
          </article>
        </div>

        {/* Tip + CTA */}
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <strong className="text-base text-[#1A1A1A]">Tip de retención</strong>
            </div>
            <p className="text-sm leading-7 text-[#4A4A4A]">
              El primer flujo te lleva directo a Matchmaking para generar una acción de alto impacto en los primeros minutos.
            </p>
          </div>
          <button
            className="inline-flex shrink-0 items-center gap-2 rounded-[18px] bg-[#141E30] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1A2C45] hover:shadow-md"
            onClick={onFinish}
            type="button"
          >
            Ir a Matchmaking
          </button>
        </div>

      </div>
    </section>
  );
}

export default ActivationScreen;
