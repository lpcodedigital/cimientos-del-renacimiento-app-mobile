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