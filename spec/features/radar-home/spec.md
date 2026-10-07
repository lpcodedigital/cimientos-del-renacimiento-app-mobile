# SPEC — radar-home

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2b — Radar Territorial (Home tras login)
**Feature:** `radar-home`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** PENDIENTE DE APROBACIÓN HUMANA — cero código RN hasta que el Humano apruebe esta spec
**Fecha:** 2026-10-06

---

## 1. Propósito

Sustituir el `HomePlaceholderScreen` por el **Radar Territorial** pixel-perfect de `inicio.png`: mapa a pantalla completa con **un pin por municipio** que tenga al menos una obra o capacitación, overlay de búsqueda (solo visual), chips de municipios, etiqueta del municipio del dispositivo y popup KPI municipal al tocar un pin.

Esta feature **no reabre** Fase 1 / 1.5a / 1.5b / 2a. Auth, biometría, chrome (`app-shell`), DIP, fences ESLint y contratos de login quedan **congelados**. Clean Architecture + SOLID de `tech-stack.md` §5 aplican desde la primera línea: 2b abre `src/features/home/{domain,application,infrastructure,presentation}` completo.

**Invariante estricta:** cero cambio de píxel del chrome 2a (header, franja de marca, drawer).

Fase 3 (búsqueda predictiva) y Fase 4 (ficha/detalle) permanecen **bloqueadas** hasta que el Revisor audite y el Tester Visual Humano apruebe 2b en dispositivo.

---

## 2. Decisiones del Humano (2026-10-06) — innegociables

1. **Un pin por municipio** (el endpoint ya devuelve solo municipios con ≥1 obra o capacitación). Nada de pines por obra/curso individual.
2. **Color de pines:** municipio = guinda `#6B142E`; «MI UBICACIÓN» (GPS) = dorado `#C4A35A`. Color por tipo obra/capacitación se define en Fase 3.
3. **Popup al tap de pin:** nombre del municipio, inversión total (MDP), total de obras con desglose (en proceso / concluidas) y total de capacitaciones. Con `X` que cierra y botón `Ver más` **no-op** (el detalle del municipio es Fase 4). Efecto de **onda expansiva animada** de 3 anillos alrededor del pin seleccionado.
4. **Barra de búsqueda: solo UI.** Pixel-perfect, sin foco, sin filtro, cero lógica. La funcionalidad es Fase 3.
5. **Chips de municipios:** los nombres vienen del endpoint. Tap en chip = centrar cámara en ese municipio (`animateToRegion`) + chip pasa a estado seleccionado (color activo). **No abre popup.**
6. **Chip «MI UBICACIÓN»:** centra la cámara en el GPS del dispositivo y queda seleccionado. Si no hay permiso, lo solicita (`requestForegroundPermissionsAsync`).
7. **Etiqueta bajo los chips:** muestra el municipio **del dispositivo** (reverse geocode), siempre visible; sin permiso/GPS muestra `—`. No sigue al chip/pin seleccionado.
8. **Cámara inicial:** sin prompt al entrar. Si el permiso ya estaba concedido → centrar en GPS; si no → `fitToCoordinates` de todos los pines.
9. **Contrato real:** `GET /api/v1/dashboard/mapa-home` → `MunicipioResumenDTO` (§4.6). Cero fixture en código: HTTP real con TanStack Query; error → mapa vacío con mensaje institucional.
10. **Datos del DTO se muestran tal cual:** no se reconcilian sumas (p. ej. `totalObras` ≠ `obrasEnProceso + obrasFinalizadas` en el payload real). `VARIOS` se pinta como cualquier municipio.
11. **Dependencias nuevas (únicas):** `react-native-maps` + `expo-location`, vía `npx expo install`. Android: `android.config.googleMaps.apiKey` la proporciona el Humano (el agente no la inventa). Copy de permiso de ubicación **aprobado**: *«El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras.»*
12. Tipografía **Lato / Lato Bold**. Estilos **inline JS** con `radarPalette` / `appPalette` / `palette` (precedente NativeWind v5 iOS). Solo `Pressable`. Cero `any`, `TouchableOpacity`, `FlatList`, `auth-*`.

---

## 3. Entradas y Mockups (Source of Truth visual)

- `spec/features/radar-home/mockups/inicio.png` → **única fuente de verdad visual** del cuerpo del radar (el chrome superior ya se entregó en 2a y no se retoca).
- `spec/features/radar-home/mockups/old.png` → **NO autoritativo.** Prohibido consultarlo para UI, copy o tokens.

> **DIRECTRIZ PARA EL TRABAJADOR (ANTI-ALUCINACIÓN):** Tokens = §4 + `tech-stack.md` §2.4. Copy, layout y componentes = **§4.5** (transcripción 2026-10-06). Contrato HTTP = **§4.6** (verbatim). Prohibido re-interpretar el PNG, copiar sus textos de relleno (§4.7) ni inventar labels, endpoints o campos.

---

## 4. Tokens visuales exactos

Registrados en `/spec/constitution/tech-stack.md` §2.4. Exponer vía `@theme` en `global.css` + `src/shared/theme/tokens.ts` (`radarPalette`).

### 4.1 Overlay superior

- **Pill de búsqueda:** fondo `radar-surface #FFFFFF`, radio alto, solapada sobre el borde inferior de la franja guinda (margen superior negativo; mitad sobre guinda / mitad sobre mapa). Icono lupa Ionicons `search` color `texto-suave #5C534C`. Texto en 2 líneas, mayúsculas, `font-lato-bold`, `texto #1A1A1A`.
- **Chips:** fila horizontal con scroll (sin scrollbar). Chip activo («MI UBICACIÓN» o municipio seleccionado): fondo `radar-chip-active #C67E33`, texto `superficie #FFFFFF` `font-lato-bold`, icono `location` blanco solo en «MI UBICACIÓN». Chip inactivo: fondo `radar-chip #C3CEC0`, texto `texto #1A1A1A` `font-lato`.
- **Etiqueta dispositivo:** pill `radar-surface #FFFFFF`, icono `location` guinda `#6B142E`, texto `font-lato-bold` `texto #1A1A1A` (o `—`).

### 4.2 Mapa y pines

- Mapa a pantalla completa bajo el overlay. iOS MapKit / Android Google Maps (key del Humano).
- Pin de municipio: `radar-pin #6B142E`. Pin GPS: `radar-pin-gps #C4A35A`. Pines **sin label** en el mapa.
- **Ripple:** 3 anillos concéntricos, borde `radar-ripple` (`#C4A35A` @ 35%), animación de expansión (scale + opacity, GPU) al abrir el popup.

### 4.3 Popup KPI

- Card flotante: cabecera `radar-popup-header #D6DED1`, cuerpo `radar-popup-body #D8DAC9`, esquinas redondeadas, cola/pico triangular abajo-centro apuntando al pin.
- Cabecera: icono `location-outline` + nombre del municipio en **mayúsculas** (como viene del DTO), `font-lato-bold`, `texto #1A1A1A`. `X` (Ionicons `close`) a la derecha — desviación §6.
- Cuerpo: 3 columnas separadas por hairlines verticales: número `font-lato-bold` grande + label `font-lato` chico, todo `texto #1A1A1A`.
- Botón `Ver más` al pie: outline guinda, `Pressable`, **no-op** — desviación §6.

### 4.4 Tipografía (radar)

| Elemento | Tratamiento |
| --- | --- |
| Texto pill búsqueda | `font-lato-bold`, `texto`, mayúsculas, 2 líneas |
| Chip activo / inactivo | `font-lato-bold` blanco / `font-lato` `texto` |
| Etiqueta dispositivo | `font-lato-bold`, `texto` |
| Nombre municipio en popup | `font-lato-bold`, `texto`, mayúsculas |
| Número KPI | `font-lato-bold` grande, `texto` |
| Label KPI | `font-lato` chico, `texto` |
| `Ver más` | `font-lato-bold`, guinda |

### 4.5 Transcripción literal (2026-10-06) — el Trabajador copia esto, no relee el PNG

**Chrome (2a, congelado):** hamburguesa + `INICIO` + franja guinda con wordmark `Cimientos del Renacimiento`.

**Cuerpo, de arriba hacia abajo:**

1. **Pill de búsqueda** — rectángulo blanco redondeado solapado al borde inferior de la franja guinda. Lupa a la izquierda. Texto verbatim en 2 líneas (sin acento en CAPACITACION):

```
BUSCAR MUNICIPIO, LOCALIDAD,
OBRA O CAPACITACION
```

2. **Fila de chips** (scroll horizontal): `MI UBICACIÓN` (rellena dorado-naranja, icono location, texto blanco) + chips de municipio (gris-verdoso, texto oscuro, Title Case: `Valladolid`, `Progreso`, `Tizimín`, …).
3. **Etiqueta dispositivo** — pill blanca: pin + nombre en bold (en el PNG: `MÉRIDA`).
4. **Mapa** a pantalla completa.
5. **Popup KPI** (visible al seleccionar pin) — card centrada horizontalmente en el tercio superior del mapa, con cola abajo-centro:
   - Cabecera: `location-outline` + `MÉRIDA` (bold, grande).
   - Columna 1: `45 MDP` / `Inversión total`
   - Columna 2: `7` / `Obras (5 en proceso, 2 concluidas)`
   - Columna 3: `14` / `Capacitaciones`
6. **Ripple** — 3 anillos concéntricos translúcidos alrededor del pin seleccionado.
7. **Pines** — teardrop con agujero blanco, **sin** etiqueta de texto.

**Formatos de presentation (reglas, no copy):**

- Inversión: `totalInversion / 1e6`, `Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 })` → `{n} MDP`. `0` → `0 MDP`. Formatter en module scope (regla `js-hoist-intl`).
- Obras: `{totalObras}` + `Obras ({obrasEnProceso} en proceso, {obrasFinalizadas} concluidas)`.
- Capacitaciones: `{totalCursos}` + `Capacitaciones`.
- Chips: Title Case (`MÉRIDA` → `Mérida`, `TELCHAC PUEBLO` → `Telchac Pueblo`). Popup header: mayúsculas del DTO sin transformar. Etiqueta dispositivo: string del geocoder sin transformar.

### 4.6 Contrato HTTP (verbatim — inmutable)

`GET /api/v1/dashboard/mapa-home` (Bearer vía interceptor de `axiosClient` existente). Response `200`: array de:

```json
{
  "municipio": "MÉRIDA",
  "totalObras": 9,
  "totalCursos": 0,
  "totalInversion": 52099566.74,
  "obrasFinalizadas": 0,
  "obrasEnProceso": 1,
  "latitude": 21.0,
  "longitude": -89.6167
}
```

- El backend (Spring Boot `MunicipioResumenDTO`) serializa `Long`/`BigDecimal`/`Double` como números JSON. Wire DTO espejo 1:1 en `infrastructure/dto.ts` (cero `any`).
- El array ya viene filtrado a municipios con ≥1 obra o capacitación. Puede venir vacío.
- `latitude`/`longitude` representativas del municipio; si `null` → el municipio no pinta pin (su chip sí aparece).
- Sin `id`: la identidad del municipio es el string `municipio`.

### 4.7 Artefactos del PNG — PROHIBIDO replicar

El mockup es imagen generada con relleno corrupto. El Trabajador **no** reproduce:

1. Texto `MI MV UBICACIÓN` junto al pin dorado (no existe; el pin GPS no lleva label).
2. Labels gibberish junto a pines (`Stiods seóenti 2`, `Schevids Cohoofe de Consenie`, `Schoole Settenle de Algustina`, `Schoola de Sccorale Asocome Heki.`): los pines de municipio **no llevan label**.
3. Pines morados (`#6F337B`) y verdes (`#2D7939`): superseded por guinda/dorado (§2.2).
4. Datos KPI `45 MDP / 7 / 14`: ejemplo; los reales vienen del endpoint.
5. Icono pin morado (`#7044BD`) de la etiqueta dispositivo: se usa guinda `#6B142E`.

---

## 5. Flujo de usuario

1. Login / biometría (máquina 1.5b intacta) → raíz `App` → pantalla `Home` dentro de `AppShell` (chrome 2a intacto).
2. `GET /api/v1/dashboard/mapa-home` (TanStack Query). Loading → mapa + spinner discreto. Error → mapa vacío + mensaje institucional «No se pudo cargar el radar territorial.» (sin bloquear chrome).
3. Cámara inicial: si permiso GPS ya concedido → centrar en posición + resolver etiqueta dispositivo; si no → `fitToCoordinates` de todos los pines. **Sin prompt al entrar.**
4. Tap chip municipio → `animateToRegion` a ese municipio + chip seleccionado (color activo). No abre popup.
5. Tap «MI UBICACIÓN» → si no hay permiso, `requestForegroundPermissionsAsync`; si se concede → centrar GPS + pin dorado + chip seleccionado + actualizar etiqueta dispositivo. Si se niega → chip visible, mapa no se mueve, etiqueta `—`.
6. Tap pin municipio → **ripple animado** (3 anillos expansivos) + popup KPI del municipio (datos del DTO). El chip de ese municipio **no** cambia de estado.
7. `X` → cierra popup y apaga ripple. `Ver más` → feedback `pressed`, **cero** navegación (Fase 4).
8. Drawer del chrome funciona igual que 2a por encima del mapa.

---

## 6. Desviaciones aprobadas del mockup

1. Pines morados/verdes del PNG → guinda `#6B142E` municipio / dorado `#C4A35A` GPS.
2. El PNG no muestra `X` ni `Ver más` en el popup → se añaden por decisión del Humano (§2.3).
3. Ripple: el PNG lo congela estático → se implementa **animado** (expansión), decisión §2.3.
4. Icono pin de la etiqueta dispositivo morado → guinda.
5. Labels gibberish y `MI MV UBICACIÓN` no se replican (§4.7).
6. Lupa gris del PNG → `texto-suave #5C534C`.
7. El bezel/status bar del PNG no se pinta (igual que 2a).

---

## 7. Reglas superseded

| Regla original | Nuevo comportamiento |
| --- | --- |
| Roadmap §2b (2026-09-15): pines de `GET /api/v1/obra/mapa` + `GET /api/v1/public/curso/mapa`, callout por obra individual, slot KPI `—` | Un pin por municipio de `GET /api/v1/dashboard/mapa-home`; popup KPI agregado municipal con datos reales (enmienda 2026-10-06) |
| `HomePlaceholderScreen` como cuerpo de Inicio | `HomeScreen` (radar) lo sustituye; el placeholder se elimina |
| Chips de municipio = posible filtro de búsqueda | Chips = atajos de cámara con estado seleccionado; búsqueda = Fase 3 |

Todo lo no listado permanece intacto (auth, SecureStore, chrome 2a, `NavigationContainer key={status}`, DIP, fences).

---

## 8. Arquitectura (2b — feature completo, 4 capas)

- `src/features/home/domain/` — `MunicipioRadar`, `GeoPosition`, puertos `RadarMapRepository` / `LocationGateway`, error `RadarError`. Cero imports de Expo/Axios/React.
- `src/features/home/application/` — use cases closures: `loadRadarMap`, `getCurrentLocation` (sin prompt), `requestLocationAccess` (con prompt), `resolveDeviceMunicipio`. Cero imports de infra.
- `src/features/home/infrastructure/` — `dto.ts` (wire espejo), `AxiosRadarMapApi` (implementa `RadarMapRepository`), `ExpoLocationGateway` (implementa `LocationGateway`).
- `src/features/home/presentation/` — `HomeProvider` (estado UI del radar + use cases por props), `HomeScreen`, `RadarSearchBar`, `RadarChipRow`, `DeviceMunicipioLabel`, `RadarMap`, `MunicipioCallout`, `RadarRipple`.
- `src/app/compositionRoot.ts` — añade `createHomeUseCases()` (único importador de la infra de home).
- `App.tsx` — envuelve `HomeProvider` dentro de `AuthProvider`.
- `RootNavigator` — `HomePlaceholder` → `Home`; no aloja UI del radar.
- Estado de servidor: **TanStack Query** (`useQuery` sobre el use case). Cero estado duplicado.
- Fences ESLint: `expo-location` y `react-native-maps` prohibidos en `domain`/`application`; `expo-location` prohibido también en `presentation` (igual que biometría); `react-native-maps` permitido **solo** en `presentation` (es UI).
- Cero barrels `index.ts`. Cero `any`. Solo `Pressable`. Cero fixture de datos en código.

---

## 9. Límites (qué NO se toca)

**ESTÁ ESTRICTAMENTE PROHIBIDO:**

- Lógica de búsqueda / autocompletado / FlashList (Fase 3). Detalle de municipio / ficha / Cloudflare (Fase 4).
- Cambiar máquina de estados auth, DTOs login, claves SecureStore, chrome `app-shell`, o cualquier píxel del header/drawer 2a.
- Pedir o sugerir reescrituras del backend (mission §4). El contrato §4.6 es inmutable.
- Añadir dependencias distintas de `react-native-maps` + `expo-location`. Expo Router. Código `.swift`/`.kt`/`.java`/`.pbxproj`/`Info.plist`/`AndroidManifest.xml` a mano.
- Inventar la API key de Google Maps (la pone el Humano en `app.json` durante TASK-01).
- `TouchableOpacity`, `FlatList`, `any`, emojis, fuentes ≠ Lato, paleta `auth-*`, labels de texto en los pines.
- Correr `npx expo start` (reservado al Humano).

---

## 10. Criterios de Aceptación (CA)

- [ ] **CA-01 (Pixel-diff cuerpo):** overlay (búsqueda, chips, etiqueta) + mapa + popup empatan `inicio.png` (desviaciones solo §6).
- [ ] **CA-02 (Pines):** un pin guinda por cada municipio del endpoint; pin dorado en GPS al usar «MI UBICACIÓN»; pines sin label.
- [ ] **CA-03 (Popup):** tap pin → ripple animado de 3 anillos + card KPI con los datos reales del DTO (`{n} MDP`, obras con desglose, capacitaciones); `X` cierra; `Ver más` no-op.
- [ ] **CA-04 (Chips):** tap chip municipio → cámara centrada + chip seleccionado (color activo), sin popup; «MI UBICACIÓN» pide permiso si falta y centra GPS.
- [ ] **CA-05 (Etiqueta dispositivo):** municipio del GPS vía reverse geocode, siempre visible; `—` sin permiso; no cambia al tocar chips/pines.
- [ ] **CA-06 (Búsqueda):** pill visible pixel-perfect, sin foco ni filtro (no-op total).
- [ ] **CA-07 (Regresión):** chrome 2a (header, franja, drawer, logout) y flujos auth 1.5b idénticos; cero cambio de píxel del chrome.
- [ ] **CA-08 (Arnés):** `npx eslint .` y `npx tsc --noEmit` en verde. Cero `any` / `TouchableOpacity` / `FlatList` / `expo-router`. DIP intacto; único importador de infra de home = `compositionRoot.ts`.
- [ ] **CA-09 (Dependencias):** `package.json` solo suma `react-native-maps` + `expo-location`. `app.json` solo suma plugin `expo-location` (copy §2.11) y `android.config.googleMaps.apiKey` del Humano.
- [ ] **CA-10 (Contrato):** wire DTO espejo 1:1 de §4.6; path exacto `/api/v1/dashboard/mapa-home`; cero `any` en mappers.

CA-01…07: Tester Visual Humano en iOS + Android. CA-08…10: Revisor.

---

## 11. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` §2.3, §2.4, §5
- `/spec/constitution/roadmap.md` — Fase 2b (enmienda 2026-10-06)
- `/spec/features/core-arch-refactor/spec.md` (baseline de capas)
- `/spec/features/app-shell-menu/spec.md` (chrome congelado, invariante)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto de 2b. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
