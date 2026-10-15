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
- Tema **claro** (opcional) basado en Conectado Flow (índigo `#455BE8`, fondo `#F5F6FA`, tarjetas blancas) con UX tipo Apple. Tema **oscuro** original intacto. Botón para alternar al final del menú.
- El sidebar se mantiene navy/azul en ambos temas (`#1B2352` en claro).
- **Oscuro es el tema por defecto** en toda la plataforma (`/web`, `/app`); el **claro** (estilo Conectado Flow / Apple) se activa desde Configuración (y con el botón del menú en `/web`). Preferencia única en `app-theme-v3`.
- Variables CSS de tema en `src/index.css` (`--ui-t1/t2/t3`, `--ui-s1/s2/s3`, `--ui-panel`, `--ui-page`, `--ui-card`, `--ui-cover`). Se usan en Chats, Empresa y Asistente. Explorar usa una paleta propia en `SwipeBoard.jsx` (`EXPLORE_PALETTE`).

**Vistas convertidas a claro:** Explorar (desktop), Likes, Chats, Empresa, Asistente.
**Pendiente:** modal de detalle y filtros de Explorar, paneles/modales de Chats, edición en Empresa, historial del Asistente, Planes y Configuración, Dashboard y Proyectos (ocultas).

## App móvil `/app` (misma simplificación)
Barra inferior: **Empresa · Likes · Explorar · Chats · Asistente** (antes: Empresa · Dashboard · Explorar · Chats · Proyectos). Dashboard y Proyectos siguen en `src/App.jsx`, solo fuera de la barra (`src/components/layout/BottomNav.jsx`). Inicia en Explorar y reutiliza `LikesView` (responsive, con contador en la barra). Sigue en tema oscuro; no se tocó la estructura ni las demás vistas.

## Ajustes posteriores al primer deploy
- **Explorar (desktop):** la card del cliente ahora entra completa en una pantalla, sin scroll: foto a la izquierda y datos a la derecha (nombre, descripción, qué ofrece/busca/segmentos, conexiones en común, fotos); la barra de acciones queda debajo. Si el alto no alcanza, solo scrollea la columna de datos (`ExploreProfileCard` en `SwipeBoard.jsx`).
- **Likes:** al elegir un cliente se ve una vista previa (portada, sinergia, propuesta, qué ofrece/busca, segmentos, fotos) con Pasar / Conectar. En escritorio es un panel a la derecha de la lista; en pantallas chicas se abre como hoja inferior.
- **Chats:** las pestañas (Conversaciones / Oportunidades / Destacadas / Archivadas) se desbordaban y había que arrastrar; ahora el filtro es un botón con menú desplegable y contadores (`ChatList.jsx`).
- **Likes (web y app):** selector de vista **Tarjetas (predeterminada) / Filas** (se recuerda la elección). La vista previa del cliente está siempre disponible: panel lateral en filas + escritorio; en tarjetas (y en pantallas chicas) se abre como diálogo u hoja inferior con "Ver perfil". Cada fila/tarjeta tiene Pasar y Conectar.
- **App móvil:** la barra inferior ahora es un **marco anclado** que ocupa su propio espacio (antes flotaba encima del contenido). Los botones de like/dislike de Explorar quedan siempre por encima del nav, sin chocar (`BottomNav.jsx`, `App.jsx`, `ActionButtons.jsx`).
- **Empresa (web):** el contenido ahora va en una columna centrada de ancho acotado (`max-w-3xl`) y la cabecera pasa a ser card en escritorio; antes se estiraba a todo el ancho y las fotos de Instagram quedaban enormes (~600px, ahora ~220px). En móvil no cambia (`ProfileView.jsx`).

## Navegación web como isla flotante + ajustes (octubre)
- **Nav de `/web`:** reemplaza el sidebar lateral por una **isla flotante arriba** (`src/web/WebTopNav.jsx`, estilo Apple / "Dynamic Island"). Compacta muestra solo la sección activa con su nombre; al pasar el mouse se expande y muestra todos los nombres. Incluye Explorar · Likes · Chats · Mi Empresa · Asistente, y a la derecha búsqueda (con "Quizás te interesen" como sugeridas), notificaciones y el avatar de la empresa con menú (Planes, Configuración, Tema claro/oscuro). Los paneles se abren debajo de la isla, **sin recortarse** (las notificaciones antes salían cortadas). Se eliminó `WebSidebar.jsx`.
- **"Empresa" → "Mi Empresa"** en la isla (web) y en la barra inferior (app).
- **Asistente:** se quitó el banner "Accedé a inteligencia avanzada / Plan Scale" (`ScalePlanCard`) en web y app.
- **Modo claro:** se corrigió el texto ilegible en Configuración (variables `--ui-*`), el plan actual (texto blanco sobre azul) y el interruptor "Modo oscuro", que ahora refleja su estado real. `PricingView` ya usaba colores propios y se dejó como estaba.
- **Pendiente / a revisar en claro:** Dashboard y Proyectos (ocultas), modales de detalle de Explorar. **Explorar:** el cambio de swipe a scroll está en definición.
