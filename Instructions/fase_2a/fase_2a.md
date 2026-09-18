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