# Proyecto Conectados: estado actual (versión previa a la simplificación)

**Qué es:** plataforma para que empresas se conecten entre sí y formen alianzas comerciales. Funciona como un "match" entre negocios con complementariedad (por ejemplo, una cafetería con una marca de cosmética).

**Deploy:** `data-plus-demo-1-2.vercel.app` · Repo: `agustinorellano/Conectados-demo-1.2`

**Stack:** Vite + React 18, Tailwind v4, Framer Motion, Lucide, React Router. Tipografías: Space Grotesk (títulos) e Inter (texto).

## Tres superficies
- `/`: **Landing.** Hero con mockup de teléfono y tarjetas flotantes, cómo funciona, match inteligente, Alliance Room, Workplace, asistente IA, métricas, testimonios, precios, FAQ y CTA.
- `/web`: **Web app de escritorio** (la que se está simplificando).
- `/app`: **App móvil** con swipe de empresas.

## Web app (`/web`)
**Navegación:** sidebar tipo "dynamic island". Colapsado es una píldora de íconos y al pasar el mouse se expande. Incluye buscador de empresas, notificaciones, recomendaciones ("Quizás te interesen"), plan del usuario, Planes y Configuración.

**Vistas del menú principal (6):**
1. **Dashboard:** métricas compactas, pipeline de alianzas, agenda de reuniones y actividad reciente.
2. **Explorar:** swipe/match. En desktop es una card de perfil única con acciones flotantes (último rediseño).
3. **Chats:** conversaciones con matches, agendar reuniones, acceso a Alliance Room y al asistente.
4. **Proyectos (Workplace):** tablero de oportunidades/tareas por área, con movimiento entre estados.
5. **Asistente:** IA que sugiere oportunidades y acciones (habilitado en plan Scale).
6. **Empresa:** perfil de la empresa, editable (industria, ubicación, ramas, perfil de alianza).

**Vistas fuera del menú principal:** Planes (Starter / Growth / Scale), Configuración y Alliance Room (sala de reunión).

**Estética actual:** tema oscuro (fondo `#070C18`, azul `#1871D8`), con bordes redondeados y sombras con brillo azul.

---

## Decisiones de simplificación (en curso)
1. Ocultar **Proyectos** y **Dashboard**. Quedan en el código, solo fuera del menú.
2. Menú resultante: **Explorar** (principal, vista de inicio), **Chats**, **Empresa**, **Asistente** y una sección nueva de **Likes pendientes** (likes y super likes recibidos).
3. Después, la estética: UX tipo Apple con colorimetría clara basada en Conectadoflow.

---

## Cambios aplicados (simplificación de producto + estética clara)

**Navegación `/web`:** Explorar (inicio) · Likes · Chats · Empresa · Asistente. Dashboard y Proyectos están **ocultos del menú pero siguen en el código** (`hiddenNav` en `src/web/WebSidebar.jsx`; vistas `dashboard` y `workplace` en `src/web/WebApp.jsx`). Todavía son alcanzables desde botones internos (p. ej. el Asistente puede llevar a Proyectos).

**Likes pendientes** (`src/components/likes/LikesView.jsx`): likes y super likes recibidos, filtros, aceptar (crea match) o descartar, contador en el menú. Datos mock.

**Estética:**
- Tema **claro** (nuevo, predeterminado solo en `/web`) basado en Conectado Flow (índigo `#455BE8`, fondo `#F5F6FA`, tarjetas blancas) con UX tipo Apple. Tema **oscuro** original intacto. Botón para alternar al final del menú.
- El sidebar se mantiene navy/azul en ambos temas (`#1B2352` en claro).
- `/app` y la landing siguen oscuras por defecto; cada superficie guarda su propia preferencia (`app-theme-v2` en `/web`, `app-theme` en el resto).
- Variables CSS de tema en `src/index.css` (`--ui-t1/t2/t3`, `--ui-s1/s2/s3`, `--ui-panel`, `--ui-page`, `--ui-card`, `--ui-cover`). Se usan en Chats, Empresa y Asistente. Explorar usa una paleta propia en `SwipeBoard.jsx` (`EXPLORE_PALETTE`).

**Vistas convertidas a claro:** Explorar (desktop), Likes, Chats, Empresa, Asistente.
**Pendiente:** modal de detalle y filtros de Explorar, paneles/modales de Chats, edición en Empresa, historial del Asistente, Planes y Configuración, Dashboard y Proyectos (ocultas).

## App móvil `/app` (misma simplificación)
Barra inferior: **Empresa · Likes · Explorar · Chats · Asistente** (antes: Empresa · Dashboard · Explorar · Chats · Proyectos). Dashboard y Proyectos siguen en `src/App.jsx`, solo fuera de la barra (`src/components/layout/BottomNav.jsx`). Inicia en Explorar y reutiliza `LikesView` (responsive, con contador en la barra). Sigue en tema oscuro; no se tocó la estructura ni las demás vistas.
