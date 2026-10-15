# Proyecto Conectados — Análisis para salir al mercado (web + app)

> Documento de trabajo. Las cifras externas llevan su fuente y un aviso cuando no pude verificarlas. Lo que es **criterio mío** (no un dato) está marcado como tal. Fecha de redacción: octubre 2026.

## 1. Resumen ejecutivo

**Qué es:** una plataforma para que pymes encuentren y concreten **alianzas comerciales** entre sí (cross-marketing, beneficios cruzados, co-branding), con descubrimiento tipo feed, "likes" recibidos, chat, propuestas y un asistente de IA. Hay web (`/web`) y app móvil (`/app`) sobre la misma base.

**Tesis de mercado (criterio mío):** el espacio de "alianzas entre pymes" está **casi vacío de competidores directos** en Latinoamérica; lo que existe son redes generalistas (LinkedIn), eventos puntuales (ruedas de negocios), plataformas institucionales de comercio exterior y, sobre todo, el **canal informal** (WhatsApp, Instagram, conocidos). El riesgo principal no es un competidor, sino el **arranque en frío** (sin empresas no hay matches) y que el "swipe" se perciba como app de citas y no como herramienta de negocios.

**Recomendación en una línea:** concentrarse en **una ciudad y 2–3 rubros complementarios**, demostrar **alianzas concretadas** (no matches) y volver el producto explicable, medible y accionable desde el primer match.

## 2. Estado actual del producto

| Área | Qué hay | Observación |
|---|---|---|
| Navegación | Explorar · Likes · Chats · Mi Empresa · Asistente (Dashboard y Proyectos ocultos) | Simple y entendible |
| Explorar | Feed vertical (una empresa por pantalla), galería tipo carrusel, Conectar / Pasar / Guardar / Compartir, filtros | UX moderna; falta explicar *por qué* conviene cada empresa |
| Likes | Likes y super likes recibidos, vista tarjetas/lista, vista previa | Es el motor de retención natural |
| Chats | Conversaciones, oportunidades, propuestas, Alliance Room (sala de reunión) | Flujo completo de "conectar → proponer" |
| Mi Empresa | Perfil, equipo, forma de trabajo, capacidades, audiencia, Instagram | Base del matching |
| Asistente | Copiloto IA (modos analítico/estratégico/creativo) | Diferenciador potencial; hoy limitado al plan Scale |
| Planes | Starter (gratis), Growth ($29/mes), Scale ($79/mes) | Estructura freemium razonable |
| Tecnología | React + Vite; demo con **datos de ejemplo** (sin backend, auth ni pagos reales) | Es un prototipo de alta fidelidad, no un producto en producción |

## 3. Contexto de mercado (con fuentes)

- **Las pymes son la gran mayoría del tejido empresarial:** según CEPAL, microempresas y pymes representan cerca del **99% de las empresas** de la región y emplean a cerca de **dos tercios** de los trabajadores (otras fuentes citan ~60%). Solo cerca del **10% de las pymes latinoamericanas exporta**, frente a al menos 40% en Europa. → [CEPAL — Microempresas y Pymes](https://www.cepal.org/es/temas/micro-pequenas-medianas-empresas-mipyme/acerca-microempresas-pymes) · [DF — CEPAL sobre las Pymes](https://www.df.cl/economia-y-politica/macro/cepal-sobre-las-pymes-son-las-grandes-empresas-de-la-desigualdad) · [Forbes Perú — Mipymes, corazón económico](https://forbes.pe/economia-y-finanzas/2026-07-07/mipymes-corazon-economico-de-latinoamerica/)
- **Supervivencia:** un artículo regional indica que solo ~45% de las pymes sobrevive los dos primeros años (cifra de prensa, no verificada en la fuente primaria). → [La República](https://www.larepublica.co/globoeconomia/en-los-paises-de-la-region-45-de-las-pyme-sobreviven-los-dos-primeros-anos-3027735) *(→ las alianzas para conseguir clientes/visibilidad son un problema real, no un "nice to have")*
- **LinkedIn como referencia de red profesional:** ~141 millones de miembros en Latinoamérica (enero 2023, dato de la propia empresa); Argentina entre ~10 y ~14 millones según la fuente. → [Forbes Argentina](https://www.forbesargentina.com/columnistas/las-cifras-linkedin-red-social-profesional-cumple-20-anos-mayo-supera-900-millones-usuarios-n30895) · [Snov.io](https://snov.io/blog/es/estadisticas-de-linkedin/)
- **WhatsApp:** una encuesta de Latinobarómetro (18 países, 2018) halló ~64% de la población usándolo. **No encontré una cifra confiable sobre uso comercial por pymes**; las cifras de blogs que circulan carecen de fuente. → [Statista](https://es.statista.com/grafico/17500/uso-de-whatsapp-en-america-latina)
- **No hay dato propio de tamaño de mercado (TAM).** Habría que construirlo (nº de pymes por ciudad × % digitalizadas × disposición a pagar) y validarlo con entrevistas.

## 4. Competidores y sustitutos

### 4.1 Competidores directos (alianzas entre empresas) — casi inexistentes

| Nombre | Qué es | Evaluación |
|---|---|---|
| **Negocios ON** (Argentina) | Plataforma digital de alianzas, canjes y ventas entre usuarios; categoría "alianzas" para buscar socio estratégico. Fuente: lanzamiento 2020. | Es lo más parecido hallado. **Estado actual y usuarios: no verificados** (conviene investigarlo). → [mercado.com.ar](https://mercado.com.ar/protagonistas/negocios-on-la-nueva-plataforma-digital-de-alianzas-canjes-y-ventas-entre-usuarios) |
| **ConnectAmericas** (BID) | Red social empresarial para empresarios de la región, orientada a **comercio exterior** y financiamiento. | Foco internacional/exportador, no alianzas locales de cross-marketing. → [wwwhatsnew](https://wwwhatsnew.com/?p=200446) |
| **Easy Connection** (PUCP, Perú) | Propuesta académica que conecta pymes proveedoras con grandes compradoras. | Concepto de tesis, no producto operativo. → [PUCP](https://repositorio.pucp.edu.pe/items/9314ffb1-810c-46ab-85b3-df5978545526) |
| **Build the Americas** (BID) | App de matchmaking con proveedores locales para proyectos de infraestructura. | Nicho muy distinto (obras). |

### 4.2 Sustitutos / alternativas indirectas (los competidores reales hoy)

- **WhatsApp + Instagram + conocidos (status quo):** gratis, ya instalados y donde ocurre el trato. Es el competidor más fuerte: gana por hábito, no por funcionalidad. *(criterio mío)*
- **LinkedIn:** red profesional masiva, pero pensada para personas/empleo/ventas B2B, no para alianzas entre comercios locales.
- **Ruedas de negocios y plataformas institucionales:** Econexia (Corferias) y Cámara de Comercio de Bogotá (Colombia), ProChile (e-Ruedas, ChileB2B), REDCA (Centroamérica; una edición de 2021 reportó 602 pymes y más de US$35 millones en intenciones de negocio). Son **eventos puntuales** y con foco comercio/exportación, sin continuidad ni matching permanente. → [Portafolio](https://www.portafolio.co/negocios/todo-listo-para-la-rueda-de-virtual-mas-grande-de-econexia-545790) · [Agraria.pe](https://agraria.pe/noticias/rueda-virtual-de-negocios-de-pymes-agroalimentarias-registro-24549) · [Summa](https://revistasumma.com/?p=212635)
- **Marketplaces (Mercado Libre y similares):** venden a consumidores; Mercado Libre participó en "PyMEs al Mundo" (exportación digital, 2018), no en alianzas entre comercios. → [Aduana News](https://aduananews.com/argentina-lanza-pymes-al-mundo/)

### 4.3 Referentes globales y lecciones

- **Crossbeam / PartnerStack / PartnerTap (software de ecosistemas de partners):** muy fuertes en SaaS B2B; Crossbeam tiene plan gratuito (3 usuarios) y pricing que escala por partners y registros. No apuntan a pymes de comercio físico. → [Improvado](https://improvado.io/blog/crossbeam-competitors) · [G2 Crossbeam](https://g2.com/products/crossbeam/pricing)
- **Bumble Bizz (en retirada) y Shapr (cerrada, según una fuente de 2023):** apps de networking profesional "tipo swipe" que **no lograron sostenerse**. Lección *(criterio mío, con evidencia limitada)*: el formato de citas no basta; hace falta valor tras el match. → [Bumble — disponibilidad de Bizz](https://support.bumble.com/hc/en-us/articles/30208230972189-Availability-of-Bumble-Bizz) · [Shapr (Wikipedia)](https://en.wikipedia.org/wiki/Shapr)

## 5. Análisis FODA

### Fortalezas
- **Nicho claro y poco disputado:** alianzas locales de cross-marketing entre pymes.
- **UX moderna y simple:** 5 secciones, feed claro, galería, tipografía y diseño cuidados (web y app coherentes).
- **Flujo completo en una sola herramienta:** descubrir → like → chat → propuesta → reunión (Alliance Room).
- **Matching con datos útiles:** "qué ofrece / qué busca / segmentos / distancia / equipo".
- **Asistente de IA** como potencial diferenciador.
- **Modelo freemium** ya definido y base técnica liviana para iterar rápido.

### Debilidades
- **Es un prototipo con datos de ejemplo:** sin backend, cuentas reales, pagos, notificaciones ni moderación.
- **Sin masa crítica / efecto red:** el valor depende de cuántas empresas haya en la misma zona y rubro.
- **El matching no es explicable:** se decidió ocultar la sinergia; faltan los *motivos* del match y la señal "le interesa tu empresa".
- **Poca confianza integrada:** no hay verificación de empresas, reseñas ni historial de alianzas.
- **Poco seguimiento posterior al match:** Dashboard y Proyectos están ocultos; no se mide si la alianza se concretó ni su resultado.
- **Sin integraciones** con el canal real de las pymes (WhatsApp, Instagram real, tiendas online).
- **Marca poco distintiva** ("Proyecto Conectados") y metáfora de "likes/swipe" que puede restarle seriedad B2B.

### Oportunidades
- **~99% de las empresas son pymes** y la mayoría tiene baja digitalización B2B y poca exportación.
- **Casi sin competencia directa** en la región.
- **Canales de distribución ya existentes:** cámaras de comercio, centros comerciales, ferias, programas de apoyo a pymes y ruedas de negocios (hoy puntuales, podrían ser *clientes* o *aliados*).
- **WhatsApp como canal de activación** (recordatorios, invitaciones, continuar el chat).
- **IA aplicada:** redactar propuestas, sugerir la primera acción conjunta, estimar impacto.
- **Monetización por resultado** (alianzas concretadas) además de suscripción.
- **Verticales de alta complementariedad:** gastronomía + turismo, belleza + moda, fitness + nutrición, floristería + eventos.
- **Expansión regional** (Brasil con portugués, México, Colombia, Chile) una vez validado un mercado.

### Amenazas
- **Sustitutos gratuitos** (WhatsApp, Instagram, LinkedIn) y el hábito de "arreglar por mensaje".
- **Arranque en frío:** una ciudad vacía = producto inútil, abandono temprano.
- **Plataformas grandes** (Meta, LinkedIn, Mercado Libre) pueden sumar herramientas de alianzas.
- **Baja disposición a pagar** de pymes y volatilidad macroeconómica (precios, tipo de cambio) en varios países.
- **Spam, perfiles falsos y mala experiencia** que destruyen la confianza si no hay moderación.
- **Regulación de datos** (p. ej. protección de datos personales en Argentina, LGPD en Brasil) y términos de plataformas de terceros.
- **Antecedentes de cierre** de apps de networking tipo swipe (Bumble Bizz, Shapr).

## 6. Qué le sumaría (valor) — priorizado

1. **Match explicable:** "Por qué hacen match" con 2–3 motivos concretos (ofrece X / busca Y) y señal de **reciprocidad** ("le interesa tu empresa"). Genera confianza y mejora la decisión.
2. **Del match al resultado:** plantillas de propuesta, un **"primer paso" sugerido por IA** (cupón cruzado, evento, campaña conjunta) y un **seguimiento simple de alianzas activas** (estado, objetivo, resultado). Es la versión liviana de lo que hoy está oculto en Proyectos/Dashboard.
3. **Medición de impacto:** cupones/QR cruzados, leads y ventas atribuidas por alianza. Convierte el producto en *herramienta de negocio* y justifica el pago.
4. **Confianza:** verificación de empresa (documento fiscal local), reseñas posteriores a la alianza, insignias.
5. **WhatsApp primero:** avisos de likes y mensajes por WhatsApp, compartir perfil/invitar empresas por enlace (viralidad), continuar la conversación sin salir del canal habitual.
6. **Hiperlocal:** radio por barrio/ciudad, "rondas de alianzas" mensuales (virtuales o presenciales) con cámaras, ferias o centros comerciales.
7. **Perfil rico en pocos pasos:** onboarding de ~3 minutos hasta el primer match, con barra de completitud (el perfil sostiene todo el matching).
8. **Monetización:** mantener freemium y sumar **precio local** (moneda y medios de pago locales) y, a futuro, comisión por alianza concretada o planes por equipo.

## 7. Qué le falta antes de salir (brechas)

**Producto**
- Motivos del match, reciprocidad visible, seguimiento de alianzas, medición de resultados.
- Notificaciones (push/WhatsApp/email) y recordatorios; calendario integrado a Alliance Room.
- Moderación y reportes, bloqueo, verificación.

**Técnico**
- Backend real, autenticación, base de datos, pagos, analítica de producto, pruebas.
- Matching real (hoy es simulado) y datos reales de empresas.
- Rendimiento y accesibilidad (contraste, teclado, lectores de pantalla), PWA/instalable en móvil.

**Negocio y legal**
- Términos, privacidad, consentimiento de datos; política de contenido.
- Pricing validado con clientes y facturación local.
- Marca/nombre y dominio propios; soporte y onboarding asistido para los primeros clientes.
- Localización: español neutro/regional y **portugués** si se apunta a Brasil.

## 8. Qué cambiaría (UX/posicionamiento)

- **Posicionamiento:** pasar de "app de matches" a **"red de alianzas comerciales para pymes"**. Cuidar la metáfora de like/swipe (riesgo de parecer app de citas, como las que no prosperaron).
- **Explorar:** sumar el motivo del match y mantener el feed con scroll; ya se resolvió el rechazo con botón explícito y deshacer.
- **Likes:** convertirlo en el eje de retención (aviso inmediato por WhatsApp/push al recibir un like o super like).
- **Chats:** plantillas de propuesta y acuerdos con un clic; propuestas con estado (enviada, vista, aceptada).
- **Mi Empresa:** guiar la completitud (fotos, qué ofrece/busca, horarios, zona); sin perfil completo no se muestra en Explorar.
- **Planes:** que Starter sea lo bastante generoso para alcanzar masa crítica y que Growth/Scale cobren por **valor medible** (visibilidad, métricas, IA), no por barreras que frenen el arranque.
- **Asistente de IA:** abrirlo en una versión básica para todos (redacta propuestas, sugiere socios) y reservar lo avanzado para Scale.

## 9. Plan de salida sugerido (hipótesis a validar)

**Beachhead (primeros 90 días):**
1. **Elegir una ciudad** (p. ej. Córdoba o Rosario) y **2–3 rubros complementarios** (gastronomía, belleza, indumentaria, fitness).
2. **Sembrar 100 empresas** reales con onboarding asistido y concretar **10–20 alianzas** (la métrica que importa).
3. **Alianza con 1–2 cámaras/centros comerciales/ferias** como canal de captación y credibilidad.
4. **Entrevistar 20 dueños** antes de escalar: ¿qué problema pagan por resolver?, ¿pagan por conexión, por resultado o por herramientas?
5. Cada alianza concretada = caso de éxito local para la siguiente captación.

**Métricas guía:** perfiles completos (activación) · alianzas concretadas por empresa · tiempo hasta el primer match · retención a 30 días · conversión Starter → pago · alianzas que repiten.

**Hipótesis críticas a validar**
1. Las pymes **quieren** alianzas y no las consiguen hoy por falta de contactos, no de interés.
2. Pagan por **resultados medibles**, no por "conectar".
3. Un **canal institucional** (cámaras/centros comerciales) baja el costo de captación frente a publicidad.
4. El formato feed + propuesta **sostiene el uso** más allá de la curiosidad inicial (lección de Bumble Bizz/Shapr).

## 10. Límites de este análisis

- Las búsquedas usadas fueron generales; **no hay estudio de mercado propio**, ni entrevistas, ni datos de uso reales.
- Algunos datos son de prensa o antiguos (LinkedIn 2023, Negocios ON 2020, Latinobarómetro 2018) y varios competidores **no pude confirmar si siguen activos**.
- El cierre de Shapr proviene de **una sola fuente**.
- Las secciones de FODA, valor, brechas y plan son **criterio razonado**, no hechos verificados; deben contrastarse con clientes reales antes de decidir inversión.

---
*Fuentes consultadas (resumen): CEPAL, DF, Forbes Perú/Argentina, La República, Snov.io, Statista, Mercado.com.ar, BID/ConnectAmericas, PUCP, Portafolio, Agraria.pe, Summa, Aduana News, Improvado, G2, Bumble, Wikipedia.*
