## Prompt para iniciar TASK-01 en nueva sesión (Worker):

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-01. Cero TASK-02+. Cero componentes. Cero UI.
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md  (TASK-01, allowed_files y reglas)
- spec/features/radar-home/plan.md  (§3.1, §3.2, §3.3)
- spec/features/radar-home/spec.md  (§2.11, §4)
- spec/constitution/tech-stack.md   (§2.3, §2.4, §5)
- progress/current-task.json
- AGENTS.md

OBJETIVO TASK-01: registrar la paleta radar-*, instalar mapas/ubicación y dejar app.json listo. Sin componentes.

PASOS:
1) global.css — dentro del @theme existente, AÑADIR (no borrar Fase 1 / auth-* / app-*):
   --color-radar-surface: #ffffff;
   --color-radar-chip: #c3cec0;
   --color-radar-chip-active: #c67e33;
   --color-radar-popup-header: #d6ded1;
   --color-radar-popup-body: #d8dac9;
2) src/shared/theme/tokens.ts — AÑADIR sin modificar palette/fontFamily/authPalette/appPalette:
   export const radarPalette = {
     surface: "#FFFFFF",
     chip: "#C3CEC0",
     chipActive: "#C67E33",
     popupHeader: "#D6DED1",
     popupBody: "#D8DAC9",
     pin: "#6B142E",
     pinGps: "#C4A35A",
     ripple: "rgba(196,163,90,0.35)",
   } as const;
3) npx expo install react-native-maps expo-location   (NUNCA npm i)
4) app.json — SOLO dos cambios:
   a) plugins += ["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]
   b) android.config.googleMaps.apiKey = "AIzaSyDK7sYtxqsifCz17bM2QMMv_ok93A900JQ"
   No toques Info.plist, AndroidManifest.xml ni nada más.
5) Arnés: npx tsc --noEmit debe pasar. Verifica: git diff -- app.json muestra SOLO los dos cambios anteriores.

PROHIBIDO:
- TASK-02+, crear componentes, tocar src/features/auth/**, src/features/app-shell/**, src/app/**.
- npm i. Dependencias fuera de react-native-maps y expo-location. npx expo start.
- Editar .swift/.kt/.java/.pbxproj/Info.plist/AndroidManifest.xml a mano.
- any, TouchableOpacity, FlatList, expo-router, emojis, fuentes ≠ Lato, paleta auth-*, className en archivos nuevos.
- Inventar la API key (la entrega el Humano).

ALLOWED_FILES (solo estos):
- global.css
- src/shared/theme/tokens.ts
- package.json
- package-lock.json
- app.json
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-01 en task.md y poner su Status. Como los pasos quedan ejecutados pero pendientes de validación Humana, deja Status: READY_FOR_REVIEW (NO lo pongas COMPLETED).
- Actualizar progress/current-task.json (active_task TASK-01 status READY_FOR_REVIEW; harness_status.typecheck_passed true; notas).
- Añadir entrada en progress/history.md con versiones exactas instaladas por expo install.
- NO hagas commit salvo que el Humano lo pida.
- NO ejecutes npx expo start.

REPORTA al final: versiones instaladas, resultado de tsc, y el diff exacto de app.json y qué debo validar yo como Humano antes de autorizar TASK-01.