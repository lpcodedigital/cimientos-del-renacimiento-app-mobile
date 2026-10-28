# SPEC — nav-back-mapa-tools (Fase 4.5: Navegación de Regreso en Header, Herramientas de Mapa y Fix iOS)

> **Estado:** APROBADA (2026-10-28) por el Humano.
> Fuente de verdad de producto de Fase 4.5. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.

## 1. Objetivo

Fase intermedia de **hardening** (precedente de gobernanza: Fase 1.5) sobre las features cerradas 2a/3/4, sin reabrirlas:

1. **Fix iOS del primer arranque en frío:** eliminar la pantalla roja «No script URL provided. Make sure the packager is running… unsanitizedScriptURLString = (null)» que aparece solo en iOS al instalar e iniciar por primera vez (se cura recargando; Android inmune).
2. **Header con navegación de regreso:** en `Search` y `Detail`, el slot izquierdo del header del chrome muestra **flecha de regreso** en lugar de la hamburguesa, y el drawer queda inalcanzable en esas pantallas. Las filas de flecha duplicadas en el cuerpo de ambas pantallas se eliminan.
3. **Herramientas del mapa de Detail:** botón flotante de **recentrado del pin** y acción **«Abrir en Maps»** con selector de apps instaladas (iOS) / chooser nativo (Android).

## 2. Decisiones del Humano (2026-10-28)

1. **Fix iOS = instalar `expo-dev-client`** vía `npx expo install` (decisión sobre las opciones Orquestador: dev-client / solo procedimiento / ambas). Diagnóstico aceptado: debug build sin dev-client y sin bundle embebido (`SKIP_BUNDLING=1`); `AppDelegate.bundleURL()` depende de `RCTBundleURLProvider`, que devuelve `nil` si Metro no es alcanzable en el cold start; agravante `RCTMetroPort = $(RCT_METRO_PORT)` sin build setting definido. El `AppDelegate.swift` actual ya trae el codepath `bridge.bundleURL ?? bundleURL()` preparado para dev-client — **cero edición de archivos nativos por agentes**.
2. **Rebuild nativo exclusivo del Humano:** `npx expo prebuild` + `npx expo run:ios` / `run:android` tras TASK-01.
3. **Header back sustituye hamburguesa en Search y Detail** (petición expresa: «que en vez del menú esté la flecha para regresar; esto por lógica desactivaría la opción de ver el menú en este screen»). Home conserva hamburguesa + drawer intactos.
4. **«Abrir en Maps» = selector de apps instaladas** (decisión sobre las opciones: botón único sistema / selector / Google universal). Implementación: iOS `Alert` con Apple Maps (siempre) + Google Maps/Waze si `canOpenURL`; Android `geo:` URI con chooser nativo del sistema. `Linking` de RN core: **cero dependencias de mapas nuevas**.
5. **`LSApplicationQueriesSchemes = ["comgooglemaps", "waze"]`** en `app.json` → `ios.infoPlist` (edición autorizada; requisito de `canOpenURL` en iOS; no es archivo nativo).
6. **Recentrado del pin:** botón flotante sobre el mapa (esquina inferior derecha), `animateToRegion` al pin (deltas 0.02, 600 ms — mismos deltas del `initialRegion` actual).
7. **Cero tokens nuevos** (tech-stack §2.7): back arrow con los mismos estilos del slot de la hamburguesa; botones de mapa con `superficie`/`guinda`/paleta `detail-*` vigentes.
8. **Cero cambios funcionales** en drawer, brand bar, radar (2b), contenidos de detalle, y en domain/application/infrastructure de cualquier feature.

## 3. Insumos

- Diagnóstico iOS: exploración read-only del Orquestador (2026-10-28): `AppDelegate.swift` (`bundleURL()` verbatim), `Info.plist` (`RCTMetroPort = $(RCT_METRO_PORT)` vacío), pbxproj (`SKIP_BUNDLING=1` en Debug), `package.json` (sin `expo-dev-client`, sin `expo-updates`), `Podfile.lock` (sin pods de dev-client).
- Features congeladas: `app-shell` (2a), `home` (2b), `search` (3), `detail` (4). Cambios autorizados: §8.
- Código vigente leído verbatim por el Orquestador: `HeaderTitleProvider.tsx`, `useHeaderTitle.ts`, `AppHeader.tsx`, `DetailMapCard.tsx` (plan §3–§6).
- Patrón de referencia del drawer: `AppDrawer.tsx` ya usa `useNavigation` tipado `NativeStackNavigationProp<AppStackParamList>` a nivel container (AppHeader está bajo el mismo `NavigationContainer`; el AppStack es el navigator raíz).

## 4. Diseño

### 4.1 Header — modo de acción izquierda

- `HeaderTitleProvider` expone además `leftMode: "menu" | "back"` (default `"menu"`) y `setLeftMode`. Sin renombrar provider/hook/archivo: los imports existentes no se rompen.
- `AppHeader`: ternario estricto `leftMode === "back" ? back : hamburguesa` en el MISMO slot (mismo tamaño 44×44, `hitSlop 12`, icono tamaño 28, color `palette.texto`, `alignSelf: "flex-start"`).
  - Back: `Ionicons name="arrow-back"`, `accessibilityLabel="Volver"`, `onPress = () => navigation.goBack()` con `useNavigation<NativeStackNavigationProp<AppStackParamList>>()` (patrón calcado de `AppDrawer.tsx`).
  - Hamburguesa: intacta (`accessibilityLabel="Abrir menú"`, `onPress={onMenuPress}`).
  - Título absoluto centrado: intacto (`pointerEvents="none"`).
- **Drawer desactivado por lógica:** la hamburguesa es la única puerta al `AppDrawer`; en modo back el botón no existe → el drawer es inalcanzable en Search/Detail. Cero estado huérfano: los ítems del drawer siempre ejecutan `onClose()` antes de navegar (código vigente).
- Setters por pantalla vía `useFocusEffect` (patrón Fase 4, plan §5):
  - `HomeScreen`: `setTitle("INICIO")` + `setLeftMode("menu")` (reset explícito — el estado persiste entre pantallas igual que el título).
  - `SearchScreen`: `setTitle("BÚSQUEDA")` + `setLeftMode("back")`; **eliminar la fila de back arrow del cuerpo** y el `useNavigation` si queda huérfano.
  - `DetailScreen`: `setTitle("DETALLE")` + `setLeftMode("back")`; **eliminar la fila de back arrow del cuerpo** y el `useNavigation` si queda huérfano (`route` se conserva).

### 4.2 DetailMapCard — recentrado + Abrir en Maps

- `MapView` gana `ref` (`useRef<MapView>(null)`).
- **Botón recentrar:** círculo 40×40 flotante, posición absoluta `right: 12, bottom: 12` DENTRO del contenedor del mapa (altura 200 intacta, `borderRadius`/`overflow` intactos), fondo `superficie #FFFFFF`, sombra sutil, `Ionicons name="locate" size={20} color={palette.guinda}`, `accessibilityRole="button"`, `accessibilityLabel="Centrar ubicación"`, feedback `opacity` por `pressed`. `onPress` → `mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 600)`.
- **Fila «Abrir en Maps»:** bajo el contenedor del mapa (fuera del `overflow: hidden`), `Pressable` con `flexDirection: "row"`, `alignItems: "center"`, `gap: 8`, `paddingVertical: 10`: `Ionicons name="navigate-outline" size={20} color={palette.guinda}` + `Text` «Abrir en Maps» (Lato Bold, `palette.guinda`), `accessibilityRole="button"`, `accessibilityLabel="Abrir en Maps"`, feedback `opacity`. `onPress` → `openExternalMap(latitude, longitude)` (§4.3).
- Ambos elementos viven DENTRO de `DetailMapCard.tsx`: `ObraDetailContent`/`CursoDetailContent` quedan intactos. Label externo fijo: «Ubicación» (sin props nuevas).

### 4.3 `openExternalMap.ts` (nuevo, `detail/presentation/`)

- Firma: `export async function openExternalMap(latitude: number, longitude: number): Promise<void>`.
- **Android:** `Linking.openURL("geo:{lat},{lng}?q={lat},{lng}(Ubicación)")` (label `encodeURIComponent`). El sistema muestra su chooser nativo con las apps de mapas instaladas. `try/catch` → `Alert.alert("Mapas", "No se encontró una aplicación de mapas disponible.")`.
- **iOS:** `canOpenURL("comgooglemaps://")` y `canOpenURL("waze://")` (cada una en `try/catch` → `false` ante excepción). `Alert.alert("Abrir en Maps", undefined, botones)`:
  - «Apple Maps» (siempre) → `https://maps.apple.com/?ll={lat},{lng}&q=Ubicaci%C3%B3n`.
  - «Google Maps» (si `canGoogle`) → `https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}`.
  - «Waze» (si `canWaze`) → `waze://?ll={lat},{lng}&navigate=yes`.
  - «Cancelar» (`style: "cancel"`).
- Mensajes verbatim: título «Abrir en Maps»; error «No se encontró una aplicación de mapas disponible.».

### 4.4 Config iOS (TASK-01)

- `npx expo install expo-dev-client` (única dependencia nueva de la fase).
- `app.json` → `ios.infoPlist.LSApplicationQueriesSchemes: ["comgooglemaps", "waze"]` (único cambio de config).
- Rebuild nativo EXCLUSIVO del Humano (`prebuild` + `run:ios`/`run:android`). El `AppDelegate.swift` vigente ya es compatible con dev-client (`bridge.bundleURL ?? bundleURL()`).

## 5. Flujo de usuario

1. **Search:** Home → tap en barra de búsqueda → header muestra `←` + `BÚSQUEDA` (sin hamburguesa; drawer inalcanzable) → `←` regresa a Home.
2. **Detail (desde Search):** Search → tap en tarjeta → header muestra `←` + `DETALLE` → `←` regresa a Search (con su `←` y título propios).
3. **Home:** header muestra hamburguesa + `INICIO`; drawer abre/cierra intacto.
4. **Mapa de Detail:** usuario arrastra el mapa → pierde el pin → tap en botón flotante → cámara anima de regreso al pin (600 ms). Tap en «Abrir en Maps» → iOS: selector con las apps instaladas; Android: chooser nativo → la app externa abre la ubicación.
5. **iOS cold start:** instalar dev build → primer arranque (con `npx expo start` corriendo o vía launcher del dev-client) → **sin pantalla roja** de script URL.

## 6. Reglas superseded

| Regla previa | Supersede |
| --- | --- |
| Spec detail §2.6/§2.7 y roadmap Fase 4: «back arrow en el cuerpo (patrón Fase 3)» | Fase 4.5 mueve el back arrow al header del chrome y elimina las filas del cuerpo en Search y Detail. |
| Spec search-bar (Fase 3): «el back arrow (`navigation.goBack()`)… vive en el cuerpo de la pantalla» | Ídem para Search. |
| app.json `ios.infoPlist` limitado a `NSFaceIDUsageDescription` (Fase 1/1.5a) | Se añade `LSApplicationQueriesSchemes` (§4.4). |

## 7. Arquitectura

- **Fase de hardening: NO abre capas nuevas.** Cero cambios en `domain/`/`application/`/`infrastructure/` de cualquier feature. Todo el trabajo vive en `presentation/` (app-shell, search, detail, home) + config (`package.json`, `app.json`).
- `openExternalMap.ts` vive en `detail/presentation/` (helper de plataforma de UI; no es puerto de dominio — no hay caso de uso ni backend involucrado).
- Fences ESLint vigentes: `react-native-maps` sigue apareciendo SOLO en `DetailMapCard.tsx` (+ `RadarMap.tsx` preexistente); `openExternalMap.ts` solo importa `react-native` (`Alert`/`Linking`/`Platform`).

## 8. Límites (qué NO se toca)

- `AppDrawer.tsx`, `AppBrandBar.tsx`, `menuItems.ts`, `AppShell.tsx`: intactos (el drawer se desactiva por ausencia del botón, no por lógica nueva).
- `RootNavigator.tsx` y `src/app/navigation/types.ts`: intactos (cero rutas nuevas).
- `RadarMap.tsx`, `MunicipioCallout.tsx` y todo `home/` salvo el setter de `HomeScreen.tsx` (§4.1).
- `ObraDetailContent.tsx`, `CursoDetailContent.tsx`, `EvidenceCarousel.tsx`, `EvidenceViewerModal.tsx`, `KpiCard.tsx`, `DetailInfoRows.tsx`, `DetailSectionHeading.tsx`, `format.ts` de detail: intactos.
- `SearchInputBar.tsx`, `SearchResultCard.tsx`, `SearchEmptyState.tsx`, `format.ts` de search: intactos.
- domain/application/infrastructure de auth/home/search/detail: intactos. `compositionRoot.ts`, `App.tsx`: intactos.
- `eslint.config.js`, `metro.config.js`, `babel.config.js`: intactos.
- Archivos nativos (`ios/**`, `android/**`): PROHIBIDOS para agentes; el rebuild es del Humano.
- `app.config.js`: intacto (el cambio de `infoPlist` va en `app.json`).

## 9. Criterios de Aceptación (CA)

- **CA-01 (header back):** en Search y Detail el header muestra `←` a la izquierda y el título centrado; la hamburguesa NO aparece; el drawer NO puede abrirse en esas pantallas.
- **CA-02 (navegación back):** `←` en Search → Home; `←` en Detail (llegando desde Search) → Search.
- **CA-03 (Home intacto):** Home muestra hamburguesa + `INICIO`; el drawer abre, navega a Search y cierra sesión como antes (cero regresión 2a/3).
- **CA-04 (títulos):** `INICIO`/`BÚSQUEDA`/`DETALLE` siguen apareciendo correctamente al enfocar cada pantalla; al volver de Search a Home el título vuelve a `INICIO` y la hamburguesa reaparece.
- **CA-05 (cuerpo limpio):** Search y Detail ya NO muestran la fila de flecha en el cuerpo; la barra de búsqueda / el contenido de detalle suben a esa posición sin saltos.
- **CA-06 (recentrar):** tras mover el mapa de Detail, el botón flotante anima la cámara de vuelta al pin; el pin sigue visible y centrado.
- **CA-07 (Abrir en Maps):** iOS muestra el selector con Apple Maps siempre + Google Maps/Waze solo si están instaladas; la app elegida abre la coordenada. Android muestra el chooser nativo. Cancelar no crashea ni navega.
- **CA-08 (fix iOS):** instalación limpia del dev build en iOS + primer arranque en frío → sin pantalla roja «No script URL provided». Android sin regresión.
- **CA-09 (arnés):** `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings; bans = 0 (`any`, `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`, `className` en archivos tocados).
- **CA-10 (gates):** `git diff -- package.json` = SOLO `expo-dev-client` (+ lockfile); `git diff -- app.json` = SOLO `LSApplicationQueriesSchemes`; `git diff -- app.config.js eslint.config.js` VACÍO; features congeladas = SOLO los archivos de `task.md`.

## 10. Dependencias de constitución

- roadmap.md Fase 4.5 (insertada 2026-10-28); tech-stack.md §2.7 (header back + herramientas de mapa, cero tokens) y §6 (`expo-dev-client` + procedimiento iOS).
- Leyes absolutas vigentes: cero código nativo por agentes; `npx expo install` exclusivo para el módulo nuevo; skills de rendimiento/UI obligatorias (`.agents/skills`).
