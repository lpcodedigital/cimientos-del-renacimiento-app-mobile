# ROADMAP.md - Fases de Desarrollo (Gabinete Móvil)

> **Directriz de Orquestación:** Este roadmap es estrictamente secuencial. El Agente Orquestador tiene prohibido generar el `plan.md` de una fase si la fase anterior no ha sido auditada por el Agente Revisor y aprobada por el Tester Visual Humano.

## Fase 1: Shell Base, Navegación y Login Híbrido (Credenciales + Biometría)
* **Objetivo:** Establecer cimientos de seguridad, diseño institucional y flujo de acceso.
* **Alcance:**
  - Configuración del monorepo Expo + TypeScript + NativeWind[cite: 1].
  - Implementación de la tipografía Lato y paleta Guinda Institucional[cite: 1].
  - Pantalla 1 (Login Tradicional): Formulario de acceso inicial con Usuario y Contraseña validado contra el backend.
  - Habilitación opcional de Acceso Biométrico (FaceID / TouchID con `expo-local-authentication`)[cite: 1] para evitar teclear credenciales en sesiones futuras.
  - Persistencia del token JWT en `SecureStore`[cite: 1] y guardado de la preferencia biométrica del usuario.

## Fase 1.5: Hardening — Pulido UI/UX de Autenticación + Refactor Arquitectónico
* **Objetivo:** Elevar la experiencia visual del flujo de acceso a pixel-perfect contra mockups aprobados por el Humano, y endurecer la base de código con Clean Architecture + principios SOLID antes del crecimiento funcional de las Fases 2-4.
* **Contexto:** La Fase 1 quedó concluida y validada por el Tester Visual Humano (2026-08-29). Esta fase intermedia **no reabre la Fase 1**: la toma como baseline congelada y declara explícitamente qué reglas supersede en sus propios specs.
* **Sub-fases (estrictamente secuenciales):**
  - **Fase 1.5a — `auth-ui-polish`:** Rediseño pixel-perfect de las pantallas de autenticación (Login, nuevo Opt-In biométrico, Unlock biométrico) contra los mockups versionados en `spec/features/auth-ui-polish/mockups/`, más el ajuste del flujo de interacción (opt-in a pantalla completa, primer uso biométrico manual obligatorio, auto-prompt con reintento en arranques posteriores). Prohibido tocar arquitectura, contratos de API ni claves de SecureStore.
  - **Fase 1.5b — `core-arch-refactor`:** Refactor a Clean Architecture (capas `domain` / `application` / `infrastructure` / `presentation`) + principios SOLID en todo `/src`. **Invariante estricta:** cero cambio visual y cero cambio funcional respecto a la Fase 1.5a aprobada por el Humano.
* **Regla de bloqueo:** La Fase 2 permaneció bloqueada hasta que el Agente Revisor auditó y el Tester Visual Humano aprobó en dispositivo físico **ambas** sub-fases (1.5a el 2026-09-04/05 y 1.5b el 2026-09-10). **Desbloqueo:** 2026-09-15.

## Fase 2: Chrome de App (Menú) + Radar Territorial
* **Objetivo:** Entregar el cascarón autenticado pixel-perfect (header + drawer) y después el radar geoespacial, **sin repetir el parche 1.5**. Clean Architecture + SOLID de 1.5b aplican desde la primera línea. Mockups versionados son la fuente de verdad visual.
* **Contexto:** El párrafo original de Fase 2 (GPS + mapa + KPIs en un solo golpe, sin mockups) se **reescribe** el 2026-09-15 por decisión del Humano. No es una Fase 2.5 posterior al código: se especifica **antes** de implementar. Auth 1.5b queda congelada. Bottom Tabs aplazados en Fase 1 quedan **superseded** por el menú hamburguesa.
* **Sub-fases (estrictamente secuenciales):**
  - **Fase 2a — `app-shell-menu`:** Chrome autenticado pixel-perfect contra `spec/features/app-shell-menu/mockups/menu.png` y la franja de header de `spec/features/radar-home/mockups/inicio.png`. Header custom (hamburguesa + `INICIO`) + drawer overlay. Logout vive en el menú. Ítems de Fases 3–4 visibles si el mockup los trae, **sin navegar**. Home sigue siendo placeholder (sin mapa/GPS/HTTP de obras-cursos). Cero dependencias nuevas.
  - **Fase 2b — `radar-home`:** Reescrita el 2026-10-06 contra `spec/features/radar-home/mockups/inicio.png` y el contrato real del backend (este párrafo **supersede** la versión 2026-09-15 de pines por obra/curso con callout individual). Mapa (`react-native-maps`) + `expo-location` + **un pin por municipio** alimentado por `GET /api/v1/dashboard/mapa-home` (`MunicipioResumenDTO` agregado: municipio, totalObras, totalCursos, totalInversion, obrasFinalizadas, obrasEnProceso, latitude, longitude). Pin guinda `#6B142E` para municipio, dorado `#C4A35A` para «MI UBICACIÓN». Chips de municipios (nombres del endpoint) centran la cámara con estado seleccionado; etiqueta fija con el municipio del dispositivo vía reverse geocode; barra de búsqueda **solo visual** (la activa Fase 3). Tap en pin → ripple animado de 3 anillos + popup KPI municipal (inversión MDP, obras en proceso/concluidas, capacitaciones) con `X` que cierra y `Ver más` no-op (detalle de municipio = Fase 4). **Invariante:** cero cambio de píxel del chrome 2a. Ficha completa / Cloudflare gallery = Fase 4.
* **Arquitectura:** 2a es feature `app-shell` **solo presentation** (`src/features/app-shell/presentation/`). No se inventa `domain`/`application`/`infrastructure` vacío. `RootNavigator` solo importa `AppShell` y envuelve el stack. 2b abre `src/features/home/{domain,application,infrastructure,presentation}` con puertos, use cases (closures), DTOs de wire y `compositionRoot`. DIP/fences ESLint de 1.5b intactos.
* **Regla de bloqueo:** El Orquestador no genera el `plan.md` de 2b si 2a no está auditada por el Revisor y aprobada por el Tester Visual Humano en dispositivo. Fase 3 permanece bloqueada hasta cerrar 2b.

## Fase 3: Búsqueda Predictiva y Explorador (search-bar)
* **Reescrita el 2026-10-15** contra el contrato real del backend (`GET /api/v1/app-mobile/global-search`) y el mockup `spec/features/search-bar/mockups/Busqueda.png` (este párrafo **supersede** la versión original de barra con autocompletado de localidades). Decisiones del Humano (2026-10-15) asentadas en `spec/features/search-bar/spec.md` §2.
* **Objetivo:** Búsqueda global en tiempo real sin degradación de rendimiento (UX tipo Uber/Rappi).
* **Alcance:**
  - **Pantalla `Search` propia en el AppStack.** La `RadarSearchBar` del Home actúa como *falso input*: al tocarla navega a `Search`. El ítem «Búsqueda» del drawer también navega. **Chrome 2a congelado** (header sigue mostrando `INICIO`; cero cambio de píxel): el back arrow (`navigation.goBack()`) y el título `BÚSQUEDA` viven **en el cuerpo** de la pantalla.
  - `TextInput` real con `autoFocus`, botón **X** que limpia texto y resultados, **debounce 500 ms**, mínimo **3 caracteres** para disparar la búsqueda.
  - **Contrato real (producción):** `GET /api/v1/app-mobile/global-search?search={q}&page={n}&size=10` → Spring `Page<AppMobileGlobalSearchCardDTO>` (`idOriginal`, `tipo` `"OBRA"|"CURSO"`, `titulo`, `municipio`, `localidad`/`estatus`/`progreso` solo presentes en OBRAS por `@JsonInclude(NON_NULL)`, `descripcionCorta`, `imagenUrl` opcional). **Scroll infinito** concatenando `page+1` (`last`/`number` del Page).
  - **Regla Estricta:** implementación obligatoria con `FlashList` de Shopify (**Prohibido `FlatList`**), grid de **2 columnas**. **`expo-image`** para las imágenes remotas (HTTPS/Cloudflare) con fallback «Sin imagen» cuando `imagenUrl` ausente. Ambas dependencias autorizadas por el Humano el 2026-10-15.
  - **Tarjetas:** pill de tipo (`Obra`/`Capacitación`), título, ubicación (localidad/municipio), línea de avance `{progreso}% {estatus}` **solo en OBRAS**. El DTO **no trae monto ni fecha** → no se renderizan (el «$3.1 MDP» y «NOV 12-2025» del mockup son artefactos). Tap en tarjeta → **no-op** (detalle = Fase 4).
  - **Estados:** spinner central en primera carga, spinner pequeño al pie en paginación, contador con `totalElements`, empty state, mensaje de error institucional.
* **Arquitectura:** feature `src/features/search/{domain,application,infrastructure,presentation}` (4 capas, puertos, use case closure, DTO espejo) + `SearchProvider`/`useSearch` (calco `HomeProvider`) + `useInfiniteQuery` de TanStack Query (server state) + `compositionRoot` único importador de infra + fences ESLint. Cero cambio de píxel en chrome 2a y radar 2b (solo acciones de navegación nuevas).
* **Regla de bloqueo:** TASK-01 no inicia hasta que el Humano apruebe `spec/features/search-bar/spec.md`. Fase 4 permanece bloqueada hasta que el Revisor audite y el Tester Visual Humano apruebe Fase 3 en dispositivo.

## Fase 4: Ficha Final (Resumen Ejecutivo) y Evidencias
* **Objetivo:** Interfaz de solo-lectura con alto impacto visual y carga asíncrona de medios.
* **Alcance:**
  - Pantalla 4: Detalle Ejecutivo de la Obra/Capacitación[cite: 1].
  - Tarjetas KPI: Finanzas ($ MDP), Avance (%) y Empleo Local (% Personal Local)[cite: 1].
  - Carrusel de evidencias cronológicas (Imágenes: Antes, En Proceso, Después)[cite: 1] integradas de forma nativa a través de **Cloudflare Images**.