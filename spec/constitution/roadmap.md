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
  - **Fase 2b — `radar-home`:** Mapa (`react-native-maps`) + `expo-location` (centrar cámara) + pines de `GET /api/v1/obra/mapa` y `GET /api/v1/public/curso/mapa`. Callout básico al tap (obra: nombre, municipio, localidad, invertido vía `GET /api/v1/obra/detail/{id}` mapeado a VM de 4 campos; curso: título, municipio; localidad de curso **no existe** en DTO). Slot KPI de inversión **preparado** (`—`) hasta que exista endpoint de agregado. **Invariante:** cero cambio de píxel del chrome 2a. Ficha completa / Cloudflare gallery = Fase 4.
* **Arquitectura:** 2a es feature `app-shell` **solo presentation** (`src/features/app-shell/presentation/`). No se inventa `domain`/`application`/`infrastructure` vacío. `RootNavigator` solo importa `AppShell` y envuelve el stack. 2b abre `src/features/home/{domain,application,infrastructure,presentation}` con puertos, use cases (closures), DTOs de wire y `compositionRoot`. DIP/fences ESLint de 1.5b intactos.
* **Regla de bloqueo:** El Orquestador no genera el `plan.md` de 2b si 2a no está auditada por el Revisor y aprobada por el Tester Visual Humano en dispositivo. Fase 3 permanece bloqueada hasta cerrar 2b.

## Fase 3: Búsqueda Predictiva y Explorador
* **Objetivo:** Búsqueda en tiempo real sin degradación de rendimiento.
* **Alcance:**
  - Pantalla 3: Barra de búsqueda con autocompletado en tiempo real (*"EL CUYO"*)[cite: 1] y debounce.
  - Renderizado de resultados filtrados por localidad o municipio[cite: 1]. **Regla Estricta:** Implementación obligatoria con `FlashList` de Shopify (Prohibido usar `FlatList`).
  - Tarjetas con tags diferenciados: Obra vs Capacitación, avance y monto invertido[cite: 1].

## Fase 4: Ficha Final (Resumen Ejecutivo) y Evidencias
* **Objetivo:** Interfaz de solo-lectura con alto impacto visual y carga asíncrona de medios.
* **Alcance:**
  - Pantalla 4: Detalle Ejecutivo de la Obra/Capacitación[cite: 1].
  - Tarjetas KPI: Finanzas ($ MDP), Avance (%) y Empleo Local (% Personal Local)[cite: 1].
  - Carrusel de evidencias cronológicas (Imágenes: Antes, En Proceso, Después)[cite: 1] integradas de forma nativa a través de **Cloudflare Images**.