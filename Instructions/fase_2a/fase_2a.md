## Prompt para iniciar TASK-01 en nueva sesión (Worker):

Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil. Feature: app-shell-menu (Fase 2a).

MODO: EJECUCIÓN. Solo TASK-01. Cero TASK-02+. Cero UI. Cero GPS/mapas/HTTP de obras. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install. Cero nativo (app.json, .swift, .kt, .pbxproj).

ANTES DE ESCRIBIR (en este orden; evita node_modules, android, ios, build):
1. /AGENTS.md
2. /spec/constitution/tech-stack.md §2.2 y §5
3. /spec/features/app-shell-menu/spec.md
4. /spec/features/app-shell-menu/plan.md §3
5. /spec/features/app-shell-menu/task.md TASK-01
6. /progress/current-task.json

OBJETIVO TASK-01: registrar paleta app-* . Sin componentes. Sin navigator.

- global.css: añadir los 6 --color-app-* del plan §3.1 dentro de @theme. No tocar tokens Fase 1 ni auth-*.
- src/shared/theme/tokens.ts: añadir appPalette (plan §3.2). No modificar palette, fontFamily, authPalette.
- npx tsc --noEmit debe pasar.
- git diff -- package.json app.json vacío.

REGLAS:
- SOLO allowed_files de TASK-01 (+ progress/current-task.json, progress/history.md, spec/features/app-shell-menu/task.md).
- Cero any / TouchableOpacity / FlatList / expo-router. Cero paleta auth-*. Cero comentarios.
- No “mejorar” nada. No adelantar AppHeader/AppDrawer.

CIERRE:
1. tsc en verde.
2. NO marques TASK-01 COMPLETED ni actualices progress a TASK-02 hasta que yo (Humano) dé la task por completada.
3. DETENTE. No inicies TASK-02. Reporta: archivos tocados + resultado de tsc + diff package.json/app.json.
4. Dime que debo de validar

## Prompt para iniciar TASK-02 en nueva sesión (Worker):

Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil. Feature: app-shell-menu (Fase 2a).

MODO: EJECUCIÓN. Solo TASK-02. Cero TASK-03+. Cero wire al navigator. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install. Cero nativo (app.json, .swift, .kt, .pbxproj). Cero auth-*. Cero GPS/mapas/HTTP de obras.

ANTES DE ESCRIBIR (en este orden; evita node_modules, android, ios, build):
1. /AGENTS.md
2. /spec/constitution/tech-stack.md §2.2 y §5
3. /spec/features/app-shell-menu/spec.md
4. /spec/features/app-shell-menu/plan.md §4 y §5
5. /spec/features/app-shell-menu/task.md TASK-02
6. /progress/current-task.json

OBJETIVO TASK-02: crear las primitivas del chrome SIN cablearlas al navigator.
- src/features/app-shell/presentation/menuItems.ts (plan §4): transcribir ítems del PNG menu.png; Inicio = action "home"; resto "noop"; logout NO va en el array (pie fijo).
- src/features/app-shell/presentation/AppHeader.tsx (plan §5.1).
- src/features/app-shell/presentation/AppBrandBar.tsx (plan §5.2). Wordmark transcrito del PNG.
- src/features/app-shell/presentation/AppDrawer.tsx (plan §5.3): overlay 72% / BackHandler Android / pie «Cerrar sesión».
- src/features/app-shell/presentation/AppShell.tsx (plan §5.4).
- Solo Pressable. Cero StyleSheet.create salvo overlay/absoluteFill/ancho % justificados.
- npx tsc --noEmit debe pasar.

REGLAS:
- SOLO allowed_files de TASK-02 (+ progress/current-task.json, progress/history.md, spec/features/app-shell-menu/task.md).
- Cero any / TouchableOpacity / FlatList / expo-router. Cero paleta auth-*. Cero barrels index.ts. Cero carpetas domain/application/infrastructure en app-shell. Cero comentarios.
- No tocar RootNavigator ni HomePlaceholderScreen (eso es TASK-03). No “mejorar” nada.
- Tipografía: Lato / Lato-Bold. Wordmark serif del mockup → Lato Bold (desviación §6).
- Usa tokens app-* ya registrados (appPalette / clases bg-app-*, text-app-*).
- Nota 1.5a: si NativeWind v5 no pinta en iOS, usa estilo inline solo con appPalette/palette y documéntalo en task.md.

CIERRE:
1. tsc en verde.
2. NO marques TASK-02 COMPLETED ni actualices progress a TASK-03 hasta que yo (Humano) dé la task por completada.
3. DETENTE. No inicies TASK-03. Reporta: archivos creados + resultado de tsc + diff package.json/app.json.
4. Dime qué debo validar.

## Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil. Feature: app-shell-menu (Fase 2a).

MODO: EJECUCIÓN. Solo TASK-02. Cero TASK-03+. Cero wire al navigator. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install. Cero nativo (app.json, .swift, .kt, .pbxproj). Cero auth-*. Cero GPS/mapas/HTTP de obras.

ANTES DE ESCRIBIR (en este orden; evita node_modules, android, ios, build):
1. /AGENTS.md
2. /spec/constitution/tech-stack.md §2.2 y §5
3. /spec/features/app-shell-menu/spec.md §4.5 (transcripción literal — NO releas los PNG; copia verbatim)
4. /spec/features/app-shell-menu/plan.md §4 y §5
5. /spec/features/app-shell-menu/task.md TASK-02
6. /progress/current-task.json

OBJETIVO TASK-02: primitivas del chrome SIN cablearlas al navigator.
- menuItems.ts: array verbatim de plan §4 / spec §4.5. Inicio = "home"; resto "noop"; logout NO va en el array.
- AppHeader.tsx (plan §5.1). Título exactamente INICIO. Ionicons menu.
- AppBrandBar.tsx (plan §5.2). Wordmark exactamente «Cimientos del Renacimiento». Solo Inicio; NO en el drawer.
- AppDrawer.tsx (plan §5.3): overlay 72% / cabecera perfil useAuth (user.name + user.email, avatar person-outline; CERO hardcode Juan Pérez López) / BackHandler Android / pie log-out-outline + «Cerrar sesión».
- AppShell.tsx (plan §5.4).
- Estilos inline JS con appPalette/palette/fontFamily (precedente NativeWind v5 iOS). Solo Pressable. StyleSheet.create solo overlay/absoluteFill/ancho %.
- npx tsc --noEmit debe pasar.

REGLAS:
- SOLO allowed_files de TASK-02 (+ progress/current-task.json, progress/history.md, spec/features/app-shell-menu/task.md).
- Cero any / TouchableOpacity / FlatList / expo-router. Cero paleta auth-*. Cero barrels index.ts. Cero domain/application/infrastructure en app-shell. Cero comentarios.
- No tocar RootNavigator ni HomePlaceholderScreen. No “mejorar” nada. No inventar ítems ni acentos.
- Tipografía: Lato / Lato-Bold.

CIERRE:
1. tsc en verde.
2. NO marques TASK-02 COMPLETED ni actualices progress a TASK-03 hasta que yo (Humano) dé la task por completada.
3. DETENTE. No inicies TASK-03. Reporta: archivos creados + resultado de tsc + diff package.json/app.json.
4. Dime qué debo validar.