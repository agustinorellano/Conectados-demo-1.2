import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  ExternalLink,
  ImagePlus,
  Layers3,
  Link2,
  MapPin,
  Save,
  Sparkles,
  Tags,
  Trash2
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
    emerald: 'border-[#0B412F]/10 bg-emerald-50 text-[#0B412F]',
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

function CompanyProfile({ company, onAreaSelect, onSave }) {
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

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1871D8] via-[#135db0] to-[#0B412F] p-5 text-white shadow-[0_28px_60px_rgba(11,65,47,0.18)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)]" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] bg-white/12 shadow-sm ring-1 ring-inset ring-white/20 backdrop-blur">
                {draft.logoImage ? (
                  <img alt={draft.name} className="h-full w-full object-cover" src={draft.logoImage} />
                ) : (
                  <span className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                    {draft.name
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </span>
                )}
              </div>
              <button
                className="absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#1871D8] shadow-lg transition hover:scale-105"
                onClick={() => logoInputRef.current?.click()}
                type="button"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                accept="image/*"
                className="hidden"
                onChange={handleLogoSelected}
                ref={logoInputRef}
                type="file"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/75">
                Company Profile
              </p>
              <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight sm:text-[2.1rem]">
                {draft.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/82">
                {profileSummary.map((item) => (
                  <span className="rounded-full bg-white/12 px-3 py-1.5 backdrop-blur" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82">{draft.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex gap-2">
              {socialPlatforms.map((platform) => (
                <SocialLinkButton
                  href={draft.socialLinks?.[platform.key] || '#'}
                  icon={platform.icon}
                  key={platform.key}
                  label={platform.label}
                />
              ))}
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-[18px] bg-white px-4 py-3 text-sm font-semibold text-[#1871D8] shadow-lg"
              onClick={() => {
                onSave(draft);
                setSavedMessage('Cambios guardados. El perfil se actualizo al instante.');
                window.setTimeout(() => setSavedMessage(''), 1800);
              }}
              type="button"
            >
              <Save className="h-4 w-4" />
              Guardar todo
            </button>
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="rounded-[20px] bg-[#0B412F] px-4 py-3 text-sm font-medium text-white shadow-sm">
          {savedMessage}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#1871D8]">
                Perfil visual
              </p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
                Identidad y contenido del comercio
              </h2>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() => galleryInputRef.current?.click()}
              type="button"
            >
              <ImagePlus className="h-4 w-4" />
              Agregar imagen
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

          {gallery.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
              <div className="overflow-hidden rounded-[26px] bg-slate-100">
                <img
                  alt="Visual principal del comercio"
                  className="h-full min-h-[280px] w-full object-cover"
                  src={gallery[0]}
                />
              </div>
              <div className="grid gap-3">
                {gallery.slice(1, 3).map((image, index) => (
                  <img
                    alt={`Visual secundario ${index + 1}`}
                    className="h-[133px] w-full rounded-[22px] object-cover"
                    key={image}
                    src={image}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((image, index) => (
              <div
                className="rounded-[22px] bg-slate-50 p-3 ring-1 ring-inset ring-slate-200"
                key={`${image}-${index}`}
              >
                <img
                  alt={`Galeria ${index + 1}`}
                  className="h-24 w-full rounded-[16px] object-cover"
                  src={image}
                />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition hover:text-[#1871D8]"
                      onClick={() => moveGalleryImage(index, -1)}
                      type="button"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition hover:text-[#1871D8]"
                      onClick={() => moveGalleryImage(index, 1)}
                      type="button"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition hover:text-rose-500"
                    onClick={() => removeGalleryImage(index)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <EditableProfileSection
          icon={<Building2 className="h-4 w-4" />}
          isEditing={Boolean(editingSections.general)}
          onCancel={() => cancelSection('general')}
          onEdit={() => openSection('general')}
          onSave={() => saveSection('general')}
          subtitle="Datos generales"
          summary={
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{draft.name}</p>
                <p className="mt-1 text-sm leading-6 text-[#4A4A4A]">{draft.description}</p>
              </div>
              <SummaryChips items={draft.industries} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-200">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Ubicacion principal
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#1A1A1A]">
                    {draft.location.city}, {draft.location.country}
                  </p>
                </div>
                <div className="rounded-[20px] bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-200">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Sucursales
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#1A1A1A]">
                    {draft.branches.length} activas
                  </p>
                </div>
              </div>
            </div>
          }
          title="Informacion del negocio"
        >
          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="grid gap-4 md:grid-cols-2">
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
        </EditableProfileSection>

        <div className="grid gap-4">
          <EditableProfileSection
            icon={<Sparkles className="h-4 w-4" />}
            isEditing={Boolean(editingSections.offers)}
            onCancel={() => cancelSection('offers')}
            onEdit={() => openSection('offers')}
            onSave={() => saveSection('offers')}
            subtitle="Perfil de alianza"
            summary={<SummaryChips items={draft.allianceProfile.offers} tone="emerald" />}
            title="Que ofrezco"
          >
            <TagSelector
              label="Activos para ofrecer"
              onChange={(value) => updateAllianceProfile('offers', value)}
              options={ALLIANCE_TAG_OPTIONS}
              placeholder="Agregar opcion personalizada"
              selected={draft.allianceProfile.offers}
            />
          </EditableProfileSection>

          <EditableProfileSection
            icon={<Tags className="h-4 w-4" />}
            isEditing={Boolean(editingSections.needs)}
            onCancel={() => cancelSection('needs')}
            onEdit={() => openSection('needs')}
            onSave={() => saveSection('needs')}
            subtitle="Perfil de alianza"
            summary={<SummaryChips items={draft.allianceProfile.needs} tone="amber" />}
            title="Que busco"
          >
            <TagSelector
              label="Necesidades comerciales"
              onChange={(value) => updateAllianceProfile('needs', value)}
              options={ALLIANCE_TAG_OPTIONS}
              placeholder="Agregar opcion personalizada"
              selected={draft.allianceProfile.needs}
            />
          </EditableProfileSection>

          <EditableProfileSection
            icon={<Layers3 className="h-4 w-4" />}
            isEditing={Boolean(editingSections.segments)}
            onCancel={() => cancelSection('segments')}
            onEdit={() => openSection('segments')}
            onSave={() => saveSection('segments')}
            subtitle="Perfil de alianza"
            summary={<SummaryChips items={draft.allianceProfile.keySegments} />}
            title="Segmentos clave"
          >
            <TagSelector
              label="Rubros con mayor fit"
              onChange={(value) => updateAllianceProfile('keySegments', value)}
              options={INDUSTRY_OPTIONS}
              placeholder="Agregar segmento personalizado"
              selected={draft.allianceProfile.keySegments}
            />
          </EditableProfileSection>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#0B412F]">
              Areas internas
            </p>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#1A1A1A]">
              De perfil a ejecucion
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {company.internalAreas.map((area) => (
            <button
              className="group rounded-[22px] bg-slate-50 p-4 text-left ring-1 ring-inset ring-slate-200 transition hover:bg-white hover:shadow-sm"
              key={area.name}
              onClick={() =>
                onAreaSelect(
                  area.name === 'Ventas'
                    ? 'ventas'
                    : area.name === 'Marketing'
                      ? 'marketing'
                      : area.name === 'Operaciones'
                        ? 'operaciones'
                        : 'atencion'
                )
              }
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-base text-[#1A1A1A]">{area.name}</strong>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {area.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">{area.context}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1871D8]">
                Ver detalle
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CompanyProfile;
