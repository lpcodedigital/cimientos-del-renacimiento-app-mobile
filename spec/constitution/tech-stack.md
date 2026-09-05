# TECH-STACK.md - Especificación Tecnológica Móvil y Restricciones

> **Directriz de Orquestación:** Este archivo define el límite estricto de las herramientas permitidas. Está ESTRICTAMENTE PROHIBIDO para cualquier agente añadir dependencias al `package.json` o utilizar librerías alternativas que no estén explícitamente autorizadas aquí.

## 1. Core Framework (Innegociable)
- **Framework:** React Native + Expo (SDK 57).
- **Lenguaje:** TypeScript (Estricto). 
  - *Regla Absoluta:* Prohibido el uso del tipo `any`. Todos los DTOs y props deben coincidir con los contratos del backend.
- **Navegación:** React Navigation (Stack Navigator + Bottom Tabs). 

## 2. UI, Design System y Rendimiento
- **Styling Engine:** NativeWind (Tailwind CSS adaptado a React Native). 
  - *Regla Absoluta:* No mezclar clases de NativeWind con `StyleSheet.create()` a menos que se requiera calcular valores dinámicos complejos.
- **Restricciones de Rendimiento Visual:**
  - **Listas:** Uso obligatorio de `@shopify/flash-list` para renderizar el explorador de obras. *PROHIBIDO usar `FlatList` de react-native.*
  - **Interacciones:** Uso obligatorio de `Pressable` con configuraciones de feedback. *PROHIBIDO usar la librería legada `TouchableOpacity`.*
- **Fuente Oficial:** Google Font `Lato` (Cargada asíncronamente mediante `expo-font`).
  - *Decisión del Humano (2026-09-04):* los mockups de Fase 1.5a usan una fuente serif/display en el título de marca; se respetará la constitución y el título se renderiza en **Lato Bold** (desviación aprobada y documentada en el spec de la feature).
- **Mapas:** `react-native-maps` (Integrado nativamente en el ecosistema Expo).
- **Iconografía:** `Lucide React Native` o `@expo/vector-icons`.
- **Gradientes:** `expo-linear-gradient` (módulo oficial Expo; autorizado por el Humano el 2026-09-04 para los fondos guinda profundo y el botón dorado de las pantallas de autenticación de Fase 1.5a). NativeWind no soporta gradientes; este es el único mecanismo permitido.

## 2.1 Paleta extendida de autenticación (Fase 1.5a)
Los tokens de Fase 1 (`guinda #6B142E`, `dorado #C4A35A`, `fondo #F7F4F0`, etc.) siguen rigiendo las pantallas de la app autenticada (Home y Fases 2-4). Las pantallas del flujo de autenticación (Login, Opt-In biométrico, Unlock biométrico) usan exclusivamente la siguiente paleta oscura institucional, extraída por muestreo de píxeles de los mockups aprobados:

| Token | Hex | Uso |
| --- | --- | --- |
| `auth-bg-top` | `#5A1320` | Inicio del gradiente vertical de fondo. |
| `auth-bg-mid` | `#3B0917` | Tono medio del fondo (bordes). |
| `auth-bg-bottom` | `#290810` | Final del gradiente vertical de fondo. |
| `auth-crema` | `#EDD6A8` | Títulos de marca y textos destacados sobre fondo oscuro. |
| `auth-taupe` | `#A58571` | Labels, placeholders, texto secundario, links de navegación («Volver»). |
| `auth-taupe-dim` | `#6C4A44` | Texto terciario (divisor «o continúa con», subtítulos de cards inactivas). |
| `auth-dorado` | `#C9A854` | Iconos, bordes de card seleccionada, checkmarks. |
| `auth-dorado-tenue` | `#8F693B` | Links de apoyo («¿Olvidaste tu contraseña?»). |
| `auth-surface` | `#471725` | Superficie de inputs. |
| `auth-surface-border` | `#7A3B48` | Borde sutil de inputs. |
| `auth-card-active` | `#45201B` | Superficie de card biométrica seleccionada. |
| `auth-card-inactive` | `#331016` | Superficie de card biométrica no seleccionada. |
| `auth-gold-grad-start` | `#F5E5AF` | Inicio del gradiente horizontal del botón primario. |
| `auth-gold-grad-end` | `#D9B563` | Fin del gradiente horizontal del botón primario. |
| `auth-btn-text` | `#2D0A14` | Texto del botón primario dorado (guinda casi negro). |

*Regla Absoluta:* la paleta oscura `auth-*` está prohibida fuera de las pantallas de autenticación; la paleta clara de Fase 1 está prohibida dentro de ellas.

## 3. Biometría & Hardware APIs (Exclusivo Expo)
> *Nota para Agentes: Todo puente de hardware se resuelve mediante APIs de Expo. Cero código nativo escrito a mano.*
- **Autenticación Biométrica:** `expo-local-authentication` (Implementada como fallback o acceso rápido post-login tradicional).
- **Geolocalización:** `expo-location` (Manejo estricto de permisos para el Radar Territorial).
- **Almacenamiento Seguro:** `expo-secure-store` (Obligatorio para la persistencia del JWT y preferencias de usuario).

## 4. Backend & API Integration (Solo Lectura)
- **Backend:** Spring Boot 3 (Java 17) - PostgreSQL. 
  - *Regla Absoluta:* El frontend asume la API REST como inmutable. No se deben proponer reescrituras de la lógica del servidor.
- **Cliente HTTP y Estado:** Axios (peticiones base) / TanStack Query (React Query) para el caché y manejo del Server State.
- **Autenticación:** JWT (JSON Web Tokens) transmitidos vía Headers.
- **CDN de Imágenes:** Cloudflare Images (Servidas vía HTTPS). 
  - *Regla Absoluta:* Toda evidencia fotográfica debe consumirse desde la URL optimizada de Cloudflare para no saturar la memoria del dispositivo.

## 5. Arquitectura de Software (Obligatoria desde la Fase 1.5b)
> *Directriz de Orquestación:* Esta sección entra en vigor con la Fase 1.5b (`core-arch-refactor`). La Fase 1.5a tiene PROHIBIDO aplicarla (su invariante es puramente visual). El detalle normativo vive en `spec/features/core-arch-refactor/spec.md` (se redacta al cerrar 1.5a).

- **Patrón:** Clean Architecture por features, con cuatro capas y regla de dependencias estricta (las dependencias solo apuntan hacia adentro):
  1. `domain/` — Entidades, errores de dominio e **interfaces de repositorio/servicios** (puertos). Cero imports de Expo, Axios, React o SecureStore.
  2. `application/` — Casos de uso (funciones puras o clases sin framework) que orquestan puertos del dominio. Cero imports de infraestructura concreta.
  3. `infrastructure/` — Implementaciones concretas (Axios, `expo-secure-store`, `expo-local-authentication`). Implementa las interfaces del dominio.
  4. `presentation/` — React: pantallas, componentes, providers/hooks. Consume casos de uso vía composición manual (composition root), nunca infraestructura directa.
- **Principios SOLID (mínimos innegociables):**
  - **SRP:** un archivo = una responsabilidad (p. ej. `tokenStore` no conoce React; `AuthProvider` no conoce Axios).
  - **DIP:** `presentation` y `application` dependen de abstracciones del `domain`, inyectadas en el composition root.
  - **ISP/OCP/LSP:** interfaces pequeñas por capacidad (`SessionRepository`, `BiometricGateway`, `AuthApi`); extensión por nuevas implementaciones, no por modificación de casos de uso.
- **Prohibido:** dependencias circulares entre features, imports de `infrastructure` desde `domain`/`application`, estado de servidor duplicado fuera de TanStack Query, y el tipo `any` (regla ya vigente).