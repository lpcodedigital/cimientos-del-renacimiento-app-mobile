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
* **Regla de bloqueo:** La Fase 2 permanece bloqueada hasta que el Agente Revisor audite y el Tester Visual Humano apruebe en dispositivo físico **ambas** sub-fases (1.5a y 1.5b).

## Fase 2: Radar Territorial (Home Passive - GPS)
* **Objetivo:** Renderizado geoespacial de ultra-baja latencia (Carga inicial < 30s).
* **Alcance:**
  - Integración de `expo-location` para obtención de `latitude` y `longitude`[cite: 1].
  - Pantalla 2: Interfaz de Inicio con Mapa de fondo, Header con menú hamburguesa e `INICIO`[cite: 1].
  - Card flotante con KPIs del municipio detectado: Inversión Total (`ObraModel`), Obras Activas/Concluidas y Capacitaciones (`CursoModel`)[cite: 1].

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