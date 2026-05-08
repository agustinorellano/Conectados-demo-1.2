import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Crown,
  ExternalLink,
  ImagePlus,
  Layers3,
  Link2,
  MapPin,
  Save,
  Settings,
  Sparkles,
  Tags,
  Trash2,
  Zap
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BranchManager from './BranchManager';
import EditableProfileSection from './EditableProfileSection';
import MetricCard from './MetricCard';
import TagSelector from './TagSelector';
import instagramLogo from '../../assets/instagram-logo.svg';
import tiktokLogo from '../../assets/tiktok-logo.svg';
import linkedinLogo from '../../assets/linkedin-logo.svg';
import { ALLIANCE_TAG_OPTIONS, INDUSTRY_OPTIONS } from '../../utils/companyProfile';

const metricCards = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: instagramLogo,
    iconAlt: 'Instagram',
    iconTone: 'bg-white/80 shadow-sm ring-1 ring-inset ring-slate-200'
  },
  {
    key: 'tiktok',
    label: 'TikTok objetivo',
    icon: tiktokLogo,
    iconAlt: 'TikTok',
    iconTone: 'bg-slate-950 shadow-sm ring-1 ring-inset ring-slate-900'
  },
  {
    key: 'physicalSales',
    label: 'Meta local',
    icon:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="18" fill="%23ECFDF5"/><path d="M22 24H42V42H22V24Z" stroke="%230B412F" stroke-width="3.5" stroke-linejoin="round"/><path d="M18 24L22 18H42L46 24" stroke="%230B412F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 32H36" stroke="%230B412F" stroke-width="3.5" stroke-linecap="round"/></svg>',
    iconAlt: 'Meta local',
    iconTone: 'bg-emerald-50 ring-1 ring-inset ring-emerald-100'
  },
  {
    key: 'ecommerceSales',
    label: 'Canal online',
    icon:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="18" fill="%23EFF6FF"/><path d="M21 24H43V40H21V24Z" stroke="%231871D8" stroke-width="3.5" stroke-linejoin="round"/><path d="M27 46H37" stroke="%231871D8" stroke-width="3.5" stroke-linecap="round"/><path d="M32 40V46" stroke="%231871D8" stroke-width="3.5" stroke-linecap="round"/></svg>',
    iconAlt: 'Canal online',
    iconTone: 'bg-blue-50 ring-1 ring-inset ring-blue-100'
  }
];

const socialPlatforms = [
  { key: 'instagram', label: 'Instagram', icon: instagramLogo },
  { key: 'tiktok', label: 'TikTok', icon: tiktokLogo },
  { key: 'linkedin', label: 'LinkedIn', icon: linkedinLogo }
];

const sectionLabels = {
  general: 'Datos generales',
  offers: 'Que ofrezco',
  needs: 'Que busco',
  segments: 'Segmentos clave'
};

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'));
    reader.readAsDataURL(file);
  });
}

function SummaryChips({ items, tone = 'blue' }) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">Sin definir todavia.</p>;
  }

  const tones = {
    blue: 'border-[#1871D8]/14 bg-[#1871D8]/8 text-[#1567C5]',
    emerald: 'border-[#141E30]/10 bg-emerald-50 text-[#141E30]',
    amber: 'border-amber-200 bg-amber-50 text-amber-700'
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${tones[tone]}`}
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SocialLinkButton({ icon, label, href }) {
  return (
    <a
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
      href={href}
      rel="noreferrer"
      target="_blank"
      title={label}
    >
      <img alt={label} className="h-6 w-6 rounded-lg object-cover" src={icon} />
    </a>
  );
}

function CompanyProfile({ company, onAreaSelect, onSave, onOpenSettings }) {
  const [draft, setDraft] = useState(company);
  const [savedMessage, setSavedMessage] = useState('');
  const [editingSections, setEditingSections] = useState({});
  const [sectionSnapshots, setSectionSnapshots] = useState({});
  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    setDraft(company);
    setEditingSections({});
    setSectionSnapshots({});
  }, [company]);

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateLocation = (key, value) => {
    setDraft((current) => ({
      ...current,
      location: {
        ...current.location,
        [key]: value
      }
    }));
  };

  const updateAllianceProfile = (key, value) => {
    setDraft((current) => ({
      ...current,
      allianceProfile: {
        ...current.allianceProfile,
        [key]: value
      }
    }));
  };

  const updateSocialLink = (key, value) => {
    setDraft((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [key]: value
      }
    }));
  };

  const handleAddBranch = () => {
    updateDraft('branches', [
      ...draft.branches,
      { address: '', city: draft.location.city, country: draft.location.country }
    ]);
  };

  const handleChangeBranch = (index, key, value) => {
    updateDraft(
      'branches',
      draft.branches.map((branch, branchIndex) =>
        branchIndex === index ? { ...branch, [key]: value } : branch
      )
    );
  };

  const handleDeleteBranch = (index) => {
    updateDraft(
      'branches',
      draft.branches.filter((_, branchIndex) => branchIndex !== index)
    );
  };

  const handleLogoSelected = async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    updateDraft('logoImage', image);
  };

  const handleGallerySelected = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 6);
    if (!files.length) return;
    const images = await Promise.all(files.map(readFileAsDataUrl));
    updateDraft('gallery', [...draft.gallery, ...images].slice(0, 6));
  };

  const moveGalleryImage = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draft.gallery.length) return;

    const reordered = [...draft.gallery];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    updateDraft('gallery', reordered);
  };

  const removeGalleryImage = (index) => {
    updateDraft(
      'gallery',
      draft.gallery.filter((_, galleryIndex) => galleryIndex !== index)
    );
  };

  const getSectionValue = (sectionKey, source = draft) => {
    switch (sectionKey) {
      case 'general':
        return {
          name: source.name,
          description: source.description,
          industries: source.industries,
          location: source.location,
          branches: source.branches,
          socialLinks: source.socialLinks,
          logoImage: source.logoImage,
          gallery: source.gallery
        };
      case 'offers':
        return source.allianceProfile.offers;
      case 'needs':
        return source.allianceProfile.needs;
      case 'segments':
        return source.allianceProfile.keySegments;
      default:
        return null;
    }
  };

  const restoreSection = (sectionKey, snapshot) => {
    if (!snapshot) return;

    if (sectionKey === 'general') {
      setDraft((current) => ({
        ...current,
        name: snapshot.name,
        description: snapshot.description,
        industries: snapshot.industries,
        location: snapshot.location,
        branches: snapshot.branches,
        socialLinks: snapshot.socialLinks,
        logoImage: snapshot.logoImage,
        gallery: snapshot.gallery
      }));
      return;
    }

    if (sectionKey === 'offers') {
      updateAllianceProfile('offers', snapshot);
      return;
    }

    if (sectionKey === 'needs') {
      updateAllianceProfile('needs', snapshot);
      return;
    }

    if (sectionKey === 'segments') {
      updateAllianceProfile('keySegments', snapshot);
    }
  };

  const openSection = (sectionKey) => {
    setSectionSnapshots((current) => ({
      ...current,
      [sectionKey]: cloneValue(getSectionValue(sectionKey))
    }));
    setEditingSections((current) => ({ ...current, [sectionKey]: true }));
  };

  const cancelSection = (sectionKey) => {
    restoreSection(sectionKey, sectionSnapshots[sectionKey]);
    setEditingSections((current) => ({ ...current, [sectionKey]: false }));
  };

  const saveSection = (sectionKey) => {
    onSave(draft);
    setSectionSnapshots((current) => ({
      ...current,
      [sectionKey]: cloneValue(getSectionValue(sectionKey))
    }));
    setEditingSections((current) => ({ ...current, [sectionKey]: false }));
    setSavedMessage(`${sectionLabels[sectionKey]} actualizado al instante.`);
    window.setTimeout(() => setSavedMessage(''), 1800);
  };

  const profileSummary = useMemo(
    () => [
      draft.industries.join(' • '),
      `${draft.location.city}, ${draft.location.country}`,
      `${draft.branches.length} sucursal${draft.branches.length === 1 ? '' : 'es'}`
    ],
    [draft.branches.length, draft.industries, draft.location.city, draft.location.country]
  );

  const gallery = draft.gallery || [];

  const slug = draft.name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-[100px]">
      {/* HERO CARD */}
      <div className="mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#141E30]">
        {/* Cover */}
        <div className="relative h-[180px]">
          {gallery[0] ? (
            <>
              <img alt="Cover" className="h-[180px] w-full object-cover" src={gallery[0]} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141E30] via-[#141E30]/30 to-transparent" />
            </>
          ) : (
            <div className="h-[180px] bg-gradient-to-br from-[#1A2C45] to-[#141E30]" />
          )}
        </div>

        {/* Logo row */}
        <div className="flex items-start justify-between px-5 -mt-9">
          <div className="relative shrink-0">
            <button
              className="relative h-[72px] w-[72px] overflow-hidden rounded-full ring-4 ring-[#141E30] focus:outline-none"
              onClick={() => logoInputRef.current?.click()}
              type="button"
            >
              {draft.logoImage ? (
                <img alt={draft.name} className="h-full w-full object-cover" src={draft.logoImage} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#1A2C45]">
                  <span className="font-['Space_Grotesk'] text-xl font-bold text-white">
                    {draft.name
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </button>
            <input
              accept="image/*"
              className="hidden"
              onChange={handleLogoSelected}
              ref={logoInputRef}
              type="file"
            />
          </div>

          <div className="flex items-center gap-2 pt-11">
            {socialPlatforms
              .filter((p) => draft.socialLinks?.[p.key])
              .map((platform) => (
                <a
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
                  href={draft.socialLinks[platform.key]}
                  key={platform.key}
                  rel="noreferrer"
                  target="_blank"
                  title={platform.label}
                >
                  <img alt={platform.label} className="h-5 w-5 rounded-md object-cover" src={platform.icon} />
                </a>
              ))}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              onClick={onOpenSettings}
              title="Ajustes"
              type="button"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#141E30] shadow transition hover:shadow-md"
              onClick={() => {
                onSave(draft);
                setSavedMessage('Cambios guardados.');
                window.setTimeout(() => setSavedMessage(''), 1800);
              }}
              type="button"
            >
              <Save className="h-3.5 w-3.5" />
              Guardar
            </button>
          </div>
        </div>

        {/* Company info */}
        <div className="px-5 pb-5 pt-3">
          <h1 className="font-['Space_Grotesk'] text-[22px] font-bold leading-tight text-white">
            {draft.name}
          </h1>
          <p className="mt-0.5 text-[12px] text-white/50">@{slug}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">{draft.description}</p>

          <div className="my-4 border-t border-white/10" />

          <div className="flex flex-wrap gap-4 text-[13px] text-white/60">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {draft.location.city}, {draft.location.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {draft.branches.length} sucursal{draft.branches.length !== 1 ? 'es' : ''}
            </span>
            {draft.industries.length > 0 && (
              <span>{draft.industries[0]}</span>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CARD — continuous white feed */}
      <div className="mx-4 mt-3 overflow-hidden rounded-[24px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">

        {/* GALERIA VISUAL */}
        <div className="py-4">
          <div className="flex items-center justify-between px-5 mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Perfil visual
            </p>
            <button
              className="flex items-center gap-1 text-[11px] font-semibold text-[#1871D8]"
              onClick={() => galleryInputRef.current?.click()}
              type="button"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>
          <input
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleGallerySelected}
            ref={galleryInputRef}
            type="file"
          />
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
            {gallery.map((img, i) => (
              <div className="relative shrink-0" key={i}>
                <img
                  alt={`Galeria ${i + 1}`}
                  className="h-[120px] w-[120px] rounded-[18px] object-cover"
                  src={img}
                />
                <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
                    onClick={() => moveGalleryImage(i, -1)}
                    type="button"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
                    onClick={() => moveGalleryImage(i, 1)}
                    type="button"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <button
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
                  onClick={() => removeGalleryImage(i)}
                  type="button"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {gallery.length === 0 && (
              <button
                className="flex h-[120px] w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-slate-200 text-slate-400"
                onClick={() => galleryInputRef.current?.click()}
                type="button"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[11px]">Agregar</span>
              </button>
            )}
          </div>
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* QUE OFREZCO */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Que ofrezco
            </p>
            {!editingSections.offers && (
              <button
                className="text-[11px] font-semibold text-[#1871D8]"
                onClick={() => openSection('offers')}
                type="button"
              >
                Editar
              </button>
            )}
          </div>
          {editingSections.offers ? (
            <div className="space-y-4">
              <TagSelector
                label="Activos para ofrecer"
                onChange={(value) => updateAllianceProfile('offers', value)}
                options={ALLIANCE_TAG_OPTIONS}
                placeholder="Agregar opcion personalizada"
                selected={draft.allianceProfile.offers}
              />
              <div className="flex gap-3">
                <button
                  className="rounded-full bg-[#141E30] px-4 py-2 text-[12px] font-semibold text-white"
                  onClick={() => saveSection('offers')}
                  type="button"
                >
                  Guardar
                </button>
                <button
                  className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-600"
                  onClick={() => cancelSection('offers')}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <SummaryChips items={draft.allianceProfile.offers} tone="emerald" />
          )}
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* QUE BUSCO */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Que busco
            </p>
            {!editingSections.needs && (
              <button
                className="text-[11px] font-semibold text-[#1871D8]"
                onClick={() => openSection('needs')}
                type="button"
              >
                Editar
              </button>
            )}
          </div>
          {editingSections.needs ? (
            <div className="space-y-4">
              <TagSelector
                label="Necesidades comerciales"
                onChange={(value) => updateAllianceProfile('needs', value)}
                options={ALLIANCE_TAG_OPTIONS}
                placeholder="Agregar opcion personalizada"
                selected={draft.allianceProfile.needs}
              />
              <div className="flex gap-3">
                <button
                  className="rounded-full bg-[#141E30] px-4 py-2 text-[12px] font-semibold text-white"
                  onClick={() => saveSection('needs')}
                  type="button"
                >
                  Guardar
                </button>
                <button
                  className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-600"
                  onClick={() => cancelSection('needs')}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <SummaryChips items={draft.allianceProfile.needs} tone="amber" />
          )}
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* SEGMENTOS CLAVE */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Segmentos clave
            </p>
            {!editingSections.segments && (
              <button
                className="text-[11px] font-semibold text-[#1871D8]"
                onClick={() => openSection('segments')}
                type="button"
              >
                Editar
              </button>
            )}
          </div>
          {editingSections.segments ? (
            <div className="space-y-4">
              <TagSelector
                label="Rubros con mayor fit"
                onChange={(value) => updateAllianceProfile('keySegments', value)}
                options={INDUSTRY_OPTIONS}
                placeholder="Agregar segmento personalizado"
                selected={draft.allianceProfile.keySegments}
              />
              <div className="flex gap-3">
                <button
                  className="rounded-full bg-[#141E30] px-4 py-2 text-[12px] font-semibold text-white"
                  onClick={() => saveSection('segments')}
                  type="button"
                >
                  Guardar
                </button>
                <button
                  className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-600"
                  onClick={() => cancelSection('segments')}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <SummaryChips items={draft.allianceProfile.keySegments} tone="blue" />
          )}
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* INFORMACION DEL NEGOCIO */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Informacion del negocio
            </p>
            {!editingSections.general && (
              <button
                className="text-[11px] font-semibold text-[#1871D8]"
                onClick={() => openSection('general')}
                type="button"
              >
                Editar
              </button>
            )}
          </div>
          {editingSections.general ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1A1A1A]">Nombre</label>
                  <input
                    className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1871D8] focus:ring-4 focus:ring-[#1871D8]/10"
                    onChange={(event) => updateDraft('name', event.target.value)}
                    value={draft.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1A1A1A]">Descripcion</label>
                  <input
                    className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1871D8] focus:ring-4 focus:ring-[#1871D8]/10"
                    onChange={(event) => updateDraft('description', event.target.value)}
                    value={draft.description}
                  />
                </div>
              </div>
              <TagSelector
                label="Rubros"
                onChange={(value) => updateDraft('industries', value)}
                options={INDUSTRY_OPTIONS}
                placeholder="Agregar rubro personalizado"
                selected={draft.industries}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1A1A1A]">Ciudad</label>
                  <input
                    className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1871D8] focus:ring-4 focus:ring-[#1871D8]/10"
                    onChange={(event) => updateLocation('city', event.target.value)}
                    value={draft.location.city}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1A1A1A]">Pais</label>
                  <input
                    className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1871D8] focus:ring-4 focus:ring-[#1871D8]/10"
                    onChange={(event) => updateLocation('country', event.target.value)}
                    value={draft.location.country}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                  <Link2 className="h-4 w-4 text-[#1871D8]" />
                  Redes sociales
                </div>
                <div className="grid gap-3">
                  {socialPlatforms.map((platform) => (
                    <label className="space-y-2" key={platform.key}>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                        <img alt={platform.label} className="h-5 w-5 rounded-md" src={platform.icon} />
                        {platform.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1871D8] focus:ring-4 focus:ring-[#1871D8]/10"
                          onChange={(event) => updateSocialLink(platform.key, event.target.value)}
                          value={draft.socialLinks?.[platform.key] || ''}
                        />
                        <a
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:text-[#1871D8]"
                          href={draft.socialLinks?.[platform.key] || '#'}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <BranchManager
                branches={draft.branches}
                onAddBranch={handleAddBranch}
                onChangeBranch={handleChangeBranch}
                onDeleteBranch={handleDeleteBranch}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="rounded-full bg-[#141E30] px-4 py-2 text-[12px] font-semibold text-white"
                  onClick={() => saveSection('general')}
                  type="button"
                >
                  Guardar
                </button>
                <button
                  className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-600"
                  onClick={() => cancelSection('general')}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[15px] font-semibold text-[#1A1A1A]">{draft.name}</p>
              <p className="text-[13px] leading-relaxed text-slate-500">{draft.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-600">
                  <MapPin className="h-3.5 w-3.5" />
                  {draft.location.city}, {draft.location.country}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-600">
                  {draft.branches.length} sucursal{draft.branches.length !== 1 ? 'es' : ''}
                </span>
              </div>
              {socialPlatforms.filter((p) => draft.socialLinks?.[p.key]).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {socialPlatforms
                    .filter((p) => draft.socialLinks?.[p.key])
                    .map((p) => (
                      <a
                        className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-200"
                        href={draft.socialLinks[p.key]}
                        key={p.key}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <img alt={p.label} className="h-3.5 w-3.5 rounded-sm" src={p.icon} />
                        <span className="max-w-[140px] truncate">{draft.socialLinks[p.key]}</span>
                      </a>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-5 border-t border-slate-100" />

        {/* METRICAS */}
        <div className="px-5 py-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Metricas
          </p>
          <div className="grid grid-cols-2 gap-3">
            {metricCards.map((metric) => (
              <MetricCard
                icon={metric.icon}
                iconAlt={metric.iconAlt}
                iconTone={metric.iconTone}
                key={metric.key}
                title={metric.label}
                value={company.metrics[metric.key]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MI PLAN — compact widget */}
      <div className="mx-4 mt-4 overflow-hidden rounded-[24px]"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,32,0.92) 0%, rgba(8,20,46,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 28px rgba(0,0,0,0.20)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4A9FFF]">Tu plan</p>
            <p className="mt-1 font-['Space_Grotesk'] text-lg font-bold capitalize text-white">
              {company.plan || 'Starter'}
            </p>
            <p className="mt-0.5 text-[11px] text-white/45">
              {company.plan === 'scale'
                ? 'Acceso completo a todas las funciones'
                : company.plan === 'growth'
                  ? 'Matches ilimitados · 1 Boost mensual'
                  : 'Actualizá para desbloquear más funciones'}
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-[14px] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5"
            onClick={onOpenSettings}
            style={{
              background: 'linear-gradient(135deg, #1871D8, #1459B0)',
              boxShadow: '0 4px 16px rgba(24,113,216,0.35)',
            }}
            type="button"
          >
            {company.plan === 'scale' ? (
              <Crown className="h-3.5 w-3.5" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {company.plan === 'scale' ? 'Premium' : 'Mejorar plan'}
          </button>
        </div>
      </div>

      {/* TOAST */}
      {savedMessage && (
        <div className="fixed bottom-[90px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#141E30] px-5 py-2.5 text-[13px] font-medium text-white shadow-lg">
          {savedMessage}
        </div>
      )}
    </div>
  );
}

export default CompanyProfile;
