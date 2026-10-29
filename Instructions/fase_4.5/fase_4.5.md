MODO: ORQUESTACIÓN (Lead Planner). NO ejecutas código ni TASKs — solo lees,
planificas y escribes SDD (spec/plan/task), enmiendas constitucionales y
progress/*. El Trabajador (DeepSeek) ejecuta en sesiones aparte. El Humano
valida en físico.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN +
TS strict + NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés)
2. progress/current-task.json (estado vivo del proyecto)
3. progress/history.md — SOLO las entradas 
4. spec/constitution/roadmap.md 
5. spec/constitution/tech-stack.md 
6. spec/constitution/mission.md 

Diseña una estrategia y plan para poder soculucionar algunos errores, asi como tambien modifcar diseño y funcionalidades de las fases anteriores, tambien queiro agregar una nueva funcionalidad a la app.

Erro: En iOS se presenta una error al instalar e iniciar por primera vez la apliación, el error en especifico es: No script URL provided. Make sure the packager is running or you have embedded a JS bundle in your application bundle. unsanitizedScriptURLString = (null). Se soluciona simplemente recargando la app, solo en iOS se presenta esto en Android no.

Modificacion: Modificar el screen de busqueda, actualmente al iniciar la app y presionar en la barra de busqueda que aparece en el inicio de la app me redirige a la pantalla de busqueda, la cual tiene en su header tiene el menu tipo hamburguesa en esquina superior izquirda y en el centro el nombre del screen actual "Busqueda" de bajo una franja guinda con el titulo en el centro que dice "Cimientos del Renacimiento" de bajo de esta franja esta la en la esquina superiror izquirda la flecha para regresar y de bajo de esta la barra de bsuqueda y debajo de la barra aparecen los resultado que coincidan. Lo que quiero es mejorar la intefaz en esta pantalla, quiero que no este el menu tipo hambuerguesa, que en vez del menu este la flecha para regresar a la pantalla anterior, esto por logica desactivaria la opcion de ver el menu en este screen igual.

Modificacion: Teniendo en cuenta la modificacion que se llevera a cabo en la pantalla de busqueda igual queiro que se  aplique en la pantalla de detalle de algun resultado seleccionado, actualmente al seleccionar un resultado esta me redifirige a la pantalla de detalle la cual presenta la misma estructura de funcionalidad que la de busqueda y por eso quiero modificar como funciona la navegacion para regresar, quiero quitar el menu de hamburguesa que esta en la parte superior izqueirda en el header de ese screen y en vez del menu poner la flecha para regresar a la pantalla anterior ya que actualmente la flecha de regresar esta de bajo de la franja guinda, esto por logica desactivaria la opcion de ver el menu en este screen igual.

Mejora y nueva modificacion: En la pantall de detalle tanto para obra o capacitacion tiene una seccion de mapa, quisiera que este mapa tubiera un boton para centrar el pin de nuevo ya que no tiene uno ahora y es muy probable que esto sea un problema y agregarle una opcion abajo para poder abrir con alguna aplicacion de mapas que tenga instalado en usuario.

Nueva feature: Actualmente en el inicio tenemos un mapa que consulta a un endpoint que devuelve por municipio cuantas obras hay, la inversion total, total de obras y su estatus y campacitaciones en un modal, este modal tenia una opcion de ver detalle la cual se oculto ya que no tenia funcionalidad definida pero ahora ya se definio como se usara. La idea es activar de nuevo la opcion de ver detalle en este modal aqui es donde empieza lo nuevo, la idea es que el usuario al precionar la opcion "Ver detalle" del modal este consulto a un enpoint en especifico que devolvera todas las obras y capacitaciones que hayan en ese municipio unicamente devolvera lo necesario ya que al presionar ver detalle y despues de optener la informacion del enpoint este me mandara a un screen con un mapara como el del inicio pero solo con la informacion obtenida que servira para poder vizualizarlas en el mapa por ejemplo (Id, nombre, Descripcion, localidad, municipio, avance, latitud y longiutd para poder poner un marcador en el mapa) y que tenga una opcion de ver mas detalle y este redirija al detalle que tiene incluso la galerria, lo que no se si se puede reutliar el screen detalle que ya existe y se usa para ver un resultado en la pantalla de busqueda, asumo que si pero el problema seria la opcion de regresar ya que cuando lo mande al detalle de una obra o capacitacion desde la pantalla del mapa donde solo se deben ver las obras del municipio que se selecciono al regresar me devolvera a la pantalla de busqueda o se puede personalizar la flecha de regresar en detalle ?

## Prompt para la nueva sesión (TASK-01):

MODO: TRABAJADOR (Execution Agent). Ejecutas UNA sola task de forma quirúrgica. NO planificas fases ni tocas archivos fuera de allowed_files.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN 0.86 + TS strict + NativeWind v5 + React Navigation 7 + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés de control)
2. progress/current-task.json (estado vivo — active_feature: nav-back-mapa-tools, TASK-01 IN_PROGRESS)
3. spec/features/nav-back-mapa-tools/spec.md (APROBADA por el Humano 2026-10-28)
4. spec/features/nav-back-mapa-tools/task.md — SOLO la sección TASK-01
5. spec/features/nav-back-mapa-tools/plan.md — SOLO §3 (TASK-01 — Config iOS)
6. app.json y package.json (estado actual)

TU ÚNICA MISIÓN: TASK-01 de Fase 4.5 — Config iOS: expo-dev-client + LSApplicationQueriesSchemes. CERO código de producto.

SECUENCIA (verbatim de task.md TASK-01 / plan.md §3):
1. Ejecuta `npx expo install expo-dev-client` (PROHIBIDO `npm i`; módulo nativo solo vía expo install).
2. Edita `app.json`: dentro de `ios.infoPlist` añade `"LSApplicationQueriesSchemes": ["comgooglemaps", "waze"]` junto a `NSFaceIDUsageDescription` (que queda INTACTA, sin tocar su texto).
3. Ejecuta `npx tsc --noEmit` → debe dar exit 0.
4. Verifica gates (pégalos en tu reporte):
   - `git diff -- package.json` → SOLO la línea de `expo-dev-client` (+ lockfile).
   - `git diff -- app.json` → SOLO `LSApplicationQueriesSchemes`.
   - `git diff -- app.config.js` → VACÍO (obligatorio).
   - `git status --porcelain` → sin archivos de código modificados.

allowed_files_to_edit (ESTRICTO): `package.json`, `app.json` (+ lockfile vía expo install).

PROHIBICIONES ABSOLUTAS EN ESTA TASK:
- NO ejecutes `npx expo start`, `npx expo prebuild`, `npx expo run:ios` ni `npx expo run:android` (rebuild nativo EXCLUSIVO del Humano).
- NO toques archivos nativos (`ios/**`, `android/**`, `.swift`, `.kt`, `.pbxproj`, `Info.plist`).
- NO toques `app.config.js`, `eslint.config.js`, `metro.config.js`, `babel.config.js`, `tsconfig.json`.
- NO toques nada bajo `src/` ni `App.tsx` (cero código de producto en esta task).
- NO hagas commit (solo si el Humano lo pide explícitamente).
- NO inicies TASK-02.

NOTAS DE CONTEXTO:
- Si `npx expo install` muestra el aviso "Cannot automatically write to dynamic config at app.config.js", es esperado (precedente Fase 3): el comando NO modifica app.config.js; verifícalo con el gate de git diff.
- Motivo del cambio (no lo "arregles" de otra forma): el error iOS «No script URL provided» del primer arranque ocurre porque el debug build no tiene expo-dev-client; el AppDelegate.swift vigente ya es compatible (bridge.bundleURL ?? bundleURL()).

AL TERMINAR (Fase Registro, obligatorio):
1. Marca las checkboxes `- [x]` de TASK-01 en spec/features/nav-back-mapa-tools/task.md y cambia su Status a `READY_FOR_REVIEW (gate Humano)`.
2. Actualiza progress/current-task.json: harness_status con un campo `fase_4_5_task_01_run` (fecha, comandos ejecutados, salidas de tsc y de los git diff/gates); active_task status → READY_FOR_REVIEW.
3. Añade entrada en progress/history.md bajo "## Fase 4.5" (qué se instaló, qué se editó, resultados del arnés y gates, hallazgos).
4. PARADA CONTROLADA: reporta al Humano que el rebuild nativo (npx expo prebuild + npx expo run:ios + npx expo run:android) y la validación CA-08 (instalación limpia → primer arranque en frío sin pantalla roja; Android sin regresión) son suyos. TASK-02 NO inicia sin su autorización.

# Prompt para iniciar TASK-02 en nueva sesión:
MODO: TRABAJADOR (Execution Agent). Ejecutas UNA sola task de forma quirúrgica. NO planificas fases ni tocas archivos fuera de allowed_files.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN 0.86 + TS strict + NativeWind v5 + React Navigation 7 + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés de control)
2. progress/current-task.json (estado vivo — active_feature: nav-back-mapa-tools; TASK-01 COMPLETED; TASK-02 DESBLOQUEADA)
3. spec/features/nav-back-mapa-tools/spec.md (APROBADA 2026-10-28; §§4.1, 8, 9 CA-01…CA-05, CA-09, CA-10)
4. spec/features/nav-back-mapa-tools/task.md — SOLO la sección TASK-02
5. spec/features/nav-back-mapa-tools/plan.md — SOLO §4 (TASK-02 — Header con modo back) y §6 (skills) y §7 (criterio de hecho)
6. Los 5 archivos que vas a editar, en su estado ACTUAL (leer completos antes de editar).

TU ÚNICA MISIÓN: TASK-02 de Fase 4.5 — Header con modo back. Extender HeaderTitleProvider con leftMode "menu" | "back", renderizar arrow-back en AppHeader cuando leftMode === "back", y actualizar los setters de Home/Search/Detail eliminando las filas de flecha del cuerpo de Search y Detail.

SECUENCIA (verbatim de plan §4):
1. HeaderTitleProvider.tsx: añadir HeaderLeftMode, leftMode (default "menu") y setLeftMode; mantener exports existentes (HeaderTitleContext / HeaderTitleContextValue) sin romper imports. Snippet verbatim plan §4.1.
2. AppHeader.tsx: importar useNavigation + NativeStackNavigationProp + AppStackParamList; ternario estricto leftMode === "back" ? back(arrow-back, accessibilityLabel="Volver", navigation.goBack()) : hamburguesa (intacta, accessibilityLabel="Abrir menú"). Mismo slot/estilos. Snippet verbatim plan §4.3.
3. HomeScreen.tsx: useFocusEffect con setTitle("INICIO") + setLeftMode("menu").
4. SearchScreen.tsx: useFocusEffect con setTitle("BÚSQUEDA") + setLeftMode("back"); ELIMINAR la fila de back arrow del cuerpo (View flexDirection row + Pressable "Volver" + Ionicons arrow-back) y limpiar imports huérfanos (useNavigation/Ionicons/Pressable) según eslint. Resto intacto.
5. DetailScreen.tsx: useFocusEffect con setTitle("DETALLE") + setLeftMode("back"); ELIMINAR backRowStyle y su Pressable/Ionicons arrow-back; eliminar useNavigation si queda huérfano; conservar route y los dos useQuery intactos.
6. Arnés: `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0 SIN warnings (cero no-unused-vars).
7. Verificación/gates (pégalos en tu reporte):
   - `git diff --stat -- src/features` → SOLO los 5 archivos de código de esta task.
   - Greps: cero `arrow-back` en el cuerpo de Search/Detail; `AppStackParamList` importado solo en AppHeader.tsx (app-shell) + preexistentes; `setLeftMode` presente en los 3 screens.
   - `git diff -- package.json app.json app.config.js eslint.config.js metro.config.js babel.config.js tsconfig.json` → VACÍO (cero deps/config en esta task).
   - `git status --porcelain` → sin archivos fuera de allowed_files.

allowed_files_to_edit (ESTRICTO):
- src/features/app-shell/presentation/HeaderTitleProvider.tsx
- src/features/app-shell/presentation/AppHeader.tsx
- src/features/home/presentation/HomeScreen.tsx
- src/features/search/presentation/SearchScreen.tsx
- src/features/detail/presentation/DetailScreen.tsx

PROHIBICIONES ABSOLUTAS EN ESTA TASK:
- NO ejecutes `npx expo start`, `npx expo prebuild`, `npx expo run:ios` ni `npx expo run:android` (rebuild/pruebas nativas EXCLUSIVOS del Humano).
- NO toques archivos nativos (`ios/**`, `android/**`, `.swift`, `.kt`, `.pbxproj`, `Info.plist`).
- NO toques app.json, app.config.js, package.json, eslint.config.js, metro.config.js, babel.config.js, tsconfig.json.
- NO toques AppDrawer.tsx, AppBrandBar.tsx, AppShell.tsx, menuItems.ts, RootNavigator.tsx, navigation/types.ts, useHeaderTitle.ts (solo verificar mensaje intacto), RadarMap.tsx, MunicipioCallout.tsx, DetailMapCard.tsx, openExternalMap.ts, componentes de detail/search, domain/application/infrastructure, compositionRoot.ts, App.tsx.
- NO instales dependencias. NO hagas commit. NO inicies TASK-03.
- Cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`, `className` en los archivos tocados. Usa Pressable + estilos hoisted `as const` (plan §6).
- Prohibido entregar la task a medias: provider, AppHeader y setters se actualizan en la MISMA task.

AL TERMINAR (Fase Registro, obligatorio):
1. Marca `- [x]` los 7 pasos de TASK-02 en spec/features/nav-back-mapa-tools/task.md y cambia su Status a `READY_FOR_REVIEW (gate Humano)`.
2. Actualiza progress/current-task.json: active_task.id/description/status → READY_FOR_REVIEW; añade `harness_status.fase_4_5_task_02_run` (fecha, comandos, tsc/eslint, diff acotado, greps).
3. Añade entrada en progress/history.md bajo "## Fase 4.5" (qué se editó, resultados del arnés, hallazgos).
4. PARADA CONTROLADA: reporta al Humano que la validación física CA-01…CA-05 (header back en Search/Detail, drawer inalcanzable ahí, Home intacto, títulos INICIO/BÚSQUEDA/DETALLE, cuerpo limpio) es suya. TASK-03 NO inicia sin su autorización.

Contexto de cierre: TASK-01 (expo-dev-client + LSApplicationQueriesSchemes) está COMPLETED; el Humano ya validó prebuild + run:ios + run:android y CA-08. No reabras TASK-01.

# Prompt para iniciar TASK-02b en nueva sesión:

MODO: TRABAJADOR (Execution Agent). Ejecutas UNA sola task de forma quirúrgica. NO planificas fases ni tocas archivos fuera de allowed_files.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN 0.86 + TS strict + NativeWind v5 + React Navigation 7 + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés de control)
2. progress/current-task.json (estado vivo — active_feature: nav-back-mapa-tools, TASK-02b DESBLOQUEADA)
3. spec/features/nav-back-mapa-tools/spec.md — §2 decisión 9, §3 (evidencia del fuente de react-navigation), §4.1 ENMENDADO
4. spec/features/nav-back-mapa-tools/task.md — SOLO la sección TASK-02b
5. spec/features/nav-back-mapa-tools/plan.md — SOLO §4b (verbatim) y §4b.5 (gates)
6. Los archivos a editar: src/features/app-shell/presentation/AppHeader.tsx, AppShell.tsx, src/features/home/presentation/HomeScreen.tsx, src/features/search/presentation/SearchScreen.tsx, src/features/detail/presentation/DetailScreen.tsx

CONTEXTO DEL HOTFIX: TASK-02 implementó el header back con HeaderTitleProvider + setters por useFocusEffect. En Android produce un flash del estado previo (INICIO + hamburguesa) al entrar a Search/Detail porque los setters corren post-foco. TASK-02b cambia el mecanismo a DERIVACIÓN POR RUTA ACTIVA: AppHeader resuelve título/modo del estado de navegación raíz vía navigation.addListener("state") (evento emitido en el dispatch, inicio de la transición) + mapa HEADER_BY_ROUTE hoisted.

TU ÚNICA MISIÓN: TASK-02b (task.md) siguiendo plan.md §4b VERBATIM.

SECUENCIA (verbatim de task.md TASK-02b):
1. AppHeader.tsx: reescribir con plan §4b.1 verbatim (HEADER_BY_ROUTE hoisted, resolveRouteName con fallback "Home", useState inicial + useEffect con addListener("state"), ternario back/hamburguesa intacto).
   ⚠️ PROHIBIDO useNavigationState: crashea fuera del navigator ("Couldn't get the navigation state") — verificado en @react-navigation/core/src/useNavigationState.tsx. Solo addListener("state") + getState().
2. AppShell.tsx: eliminar import y wrapper <HeaderTitleProvider> (plan §4b.2 verbatim; todo lo demás intacto).
3. HomeScreen.tsx: eliminar el useFocusEffect de título/modo + imports huérfanos (useHeaderTitle, useFocusEffect, useCallback si queda sin uso).
4. SearchScreen.tsx: idem. NO reaparecer la fila de back del cuerpo.
5. DetailScreen.tsx: idem. route, queries y contenido intactos.
6. Borrar src/features/app-shell/presentation/HeaderTitleProvider.tsx y useHeaderTitle.ts (rm; sin shims ni re-exports).
7. Arnés: npx tsc --noEmit → exit 0; npx eslint . → exit 0 sin warnings.
8. Gates (pégalos en tu reporte):
   - greps = 0 en src/: useHeaderTitle, HeaderTitleProvider, setLeftMode
   - git diff --stat -- src/ = SOLO los 5 editados + 2 eliminados
   - git diff -- package.json app.json app.config.js = VACÍO
   - git status --porcelain = sin archivos ajenos a la task

allowed_files_to_edit (ESTRICTO):
- src/features/app-shell/presentation/AppHeader.tsx
- src/features/app-shell/presentation/AppShell.tsx
- src/features/home/presentation/HomeScreen.tsx
- src/features/search/presentation/SearchScreen.tsx
- src/features/detail/presentation/DetailScreen.tsx
- src/features/app-shell/presentation/HeaderTitleProvider.tsx (ELIMINAR)
- src/features/app-shell/presentation/useHeaderTitle.ts (ELIMINAR)

PROHIBICIONES ABSOLUTAS:
- NO ejecutes npx expo start / prebuild / run:* (Humano exclusivo).
- NO toques RootNavigator.tsx, navigation/types.ts, AppDrawer.tsx, AppBrandBar.tsx, menuItems.ts, ni nada de domain/application/infrastructure.
- NO instales dependencias. NO hagas commit.
- NO uses useNavigationState. NO recrees el provider bajo otro nombre.
- NO inicies TASK-03.

AL TERMINAR (Fase Registro, obligatorio):
1. Marca las checkboxes `- [x]` de TASK-02b en task.md y cambia su Status a `READY_FOR_REVIEW (gate Humano)`.
2. Actualiza progress/current-task.json: harness_status.fase_4_5_task_02b_run (fecha, diffs, salidas del arnés y gates); active_task status → READY_FOR_REVIEW.
3. Añade entrada en progress/history.md bajo "## Fase 4.5".
4. PARADA CONTROLADA: reporta al Humano que la validación física es suya — Android: al entrar a Search/Detail el header muestra ← + título correcto DESDE el inicio de la transición (sin flash de INICIO/hamburguesa) y el back responde al primer toque; iOS: sin regresión; drawer operativo en Home. TASK-03 NO inicia sin su autorización.

# Prompt para iniciar TASK-03 en nueva sesión:

MODO: TRABAJADOR (Execution Agent). Ejecutas UNA sola task de forma quirúrgica. NO planificas fases ni tocas archivos fuera de allowed_files.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN 0.86 + TS strict + NativeWind v5 + React Navigation 7 + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés de control)
2. progress/current-task.json (estado vivo — active_feature: nav-back-mapa-tools, TASK-03 DESBLOQUEADA)
3. spec/features/nav-back-mapa-tools/spec.md — §4.2 y §4.3 (diseño de las herramientas del mapa)
4. spec/features/nav-back-mapa-tools/task.md — SOLO la sección TASK-03
5. spec/features/nav-back-mapa-tools/plan.md — SOLO §5 (verbatim: openExternalMap.ts y DetailMapCard.tsx) y §7 (criterio de hecho TASK-03)
6. Los archivos actuales: src/features/detail/presentation/DetailMapCard.tsx y src/shared/theme/tokens.ts (confirma palette.superficie / palette.guinda / fontFamily["lato-bold"])

TU ÚNICA MISIÓN: TASK-03 — Herramientas del mapa de Detail (recentrar + «Abrir en Maps»), siguiendo plan.md §5 VERBATIM.

SECUENCIA (verbatim de task.md TASK-03):
1. Crear src/features/detail/presentation/openExternalMap.ts — plan §5.1 verbatim:
   - Android: Linking.openURL("geo:{lat},{lng}?q={lat},{lng}(Ubicación)") con label encodeURIComponent; catch → Alert.alert("Mapas", "No se encontró una aplicación de mapas disponible.").
   - iOS: canOpenURL("comgooglemaps://") y canOpenURL("waze://") (cada una con try/catch → false); Alert.alert("Abrir en Maps", undefined, botones): Apple Maps (siempre), Google Maps (si canGoogle), Waze (si canWaze), Cancelar (style cancel).
2. Reescribir src/features/detail/presentation/DetailMapCard.tsx — plan §5.2 verbatim:
   - MapView con ref (useRef<MapView>(null)); provider/initialRegion/props intactos.
   - Botón flotante de recentrado: círculo 40×40 absolute right 12 bottom 12 DENTRO del contenedor del mapa, fondo palette.superficie, sombra, Ionicons "locate" size 20 color palette.guinda, accessibilityLabel "Centrar ubicación" → handleRecenter: mapRef.current?.animateToRegion({latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02}, 600).
   - Fila «Abrir en Maps» BAJO el contenedor del mapa: Pressable row gap 8 paddingVertical 10, Ionicons "navigate-outline" size 20 guinda + Text "Abrir en Maps" (fontFamily["lato-bold"], palette.guinda, 15), accessibilityLabel "Abrir en Maps" → handleOpenMaps: void openExternalMap(latitude, longitude).
   - Estilos hoisted como const con `as const` (ya vienen en el plan).
3. Arnés: npx tsc --noEmit → exit 0; npx eslint . → exit 0 sin warnings.
4. Verificación (pégala en tu reporte):
   - grep: react-native-maps solo en DetailMapCard.tsx (+ RadarMap.tsx preexistente)
   - grep: Linking/Platform/Alert dentro de src/features/detail solo en openExternalMap.ts
   - git diff -- package.json app.json app.config.js → VACÍO
   - git status --porcelain → SOLO los 2 archivos de esta task
5. PARADA Y HANDOFF AL HUMANO: validación física CA-06 (mover el mapa → tap en botón flotante → la cámara anima de regreso al pin) y CA-07 (tap en «Abrir en Maps» → iOS muestra selector con Apple Maps + apps instaladas; Android muestra el chooser nativo; Cancelar no crashea ni navega; la app elegida abre la coordenada).

allowed_files_to_edit (ESTRICTO):
- src/features/detail/presentation/openExternalMap.ts (NUEVO)
- src/features/detail/presentation/DetailMapCard.tsx

PROHIBICIONES ABSOLUTAS:
- NO ejecutes npx expo start / prebuild / run:* (Humano exclusivo). NO rebuild nativo necesario en esta task (los LSApplicationQueriesSchemes ya quedaron en TASK-01).
- NO instales dependencias (Linking/Alert/Platform son RN core; @expo/vector-icons ya autorizado).
- NO toques ObraDetailContent.tsx, CursoDetailContent.tsx, DetailScreen.tsx ni nada fuera de los 2 allowed_files.
- NO hagas commit. NO inicies TASK-04.
- Cero any / TouchableOpacity / FlatList / className / expo-router.

AL TERMINAR (Fase Registro, obligatorio):
1. Marca las checkboxes `- [x]` de TASK-03 en task.md y cambia su Status a `READY_FOR_REVIEW (gate Humano)`.
2. Actualiza progress/current-task.json: harness_status.fase_4_5_task_03_run (fecha, diffs, salidas del arnés y verificaciones); active_task status → READY_FOR_REVIEW.
3. Añade entrada en progress/history.md bajo "## Fase 4.5".
4. PARADA CONTROLADA: TASK-04 (arnés/auditoría) NO inicia sin autorización del Humano.