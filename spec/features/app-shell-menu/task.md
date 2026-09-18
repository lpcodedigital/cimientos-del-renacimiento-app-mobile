# TASK — app-shell-menu

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2a — Chrome autenticado
**Feature:** `app-shell-menu`
**Ejecutor:** Agente Trabajador
**Auditor:** Agente Revisor (tras TASK-04)
**Tester visual / `expo start`:** Humano — prohibido a agentes
**Fecha:** 2026-09-15

Leer antes de tocar código: `spec.md`, `plan.md`, `/spec/constitution/tech-stack.md` (§2.2 y §5), `/AGENTS.md`.

Reglas absolutas del Trabajador:

- SOLO editar archivos listados en `allowed_files` de la task activa.
- CERO dependencias nuevas. Cero `npx expo install`. Cero `npm i`.
- Cero `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist`, `AndroidManifest.xml`, `app.json`.
- Cero Expo Router. Cero `any`. Cero `TouchableOpacity`. Cero `FlatList`. Cero emojis en UI. Cero fuentes ≠ Lato. Cero paleta `auth-*`.
- Cero GPS, mapas, HTTP de obras/cursos.
- Cero cambios en `src/features/auth/**` y `src/app/compositionRoot.ts`.
- Transcribir copy e iconografía desde `spec/features/app-shell-menu/mockups/menu.png` y el chrome de `spec/features/radar-home/mockups/inicio.png`.
- Al terminar cada task: marcar `- [x]`, actualizar `progress/current-task.json` y `progress/history.md`.
- No correr `npx expo start`. El arnés lo corre el Trabajador solo en TASK-04.

**TASK-01 no inicia** hasta autorización explícita del Humano en nueva sesión tras aprobar `spec.md`.

---

## TASK-01 — Tokens `app-*`

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** APROBADA por el Humano (2026-09-17)

**Objetivo:** Registrar paleta del chrome. Sin componentes.

**Pasos**

- [x] `global.css`: añadir los 6 `--color-app-*` del plan §3.1 dentro de `@theme`. No tocar tokens Fase 1 ni `auth-*`.
- [x] `src/shared/theme/tokens.ts`: añadir `appPalette` (plan §3.2). No modificar `palette`, `fontFamily`, `authPalette`.
- [x] `npx tsc --noEmit` debe pasar.
- [x] Verificar `git diff -- package.json app.json` vacío.

**allowed_files**

- `global.css`
- `src/shared/theme/tokens.ts`
- `spec/features/app-shell-menu/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Clases `bg-app-crema`, `text-app-gold-wordmark`, etc. disponibles. TypeCheck verde. Cero deps nuevas.

---

## TASK-02 — Componentes del chrome (sin wire al navigator)

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** APROBADA por el Humano (2026-09-18)

**Objetivo:** Primitivas del shell según plan §4–§5 y spec §4.5. `RootNavigator` no se toca. **Prohibido releer/inventar copy de los PNG:** usar la transcripción de spec §4.5 / plan §4.

**Copy e iconos (verbatim — no alterar acentos ni ionicon):**

- Wordmark `AppBrandBar` (solo Inicio): `Cimientos del Renacimiento`
- Header título: `INICIO` · hamburguesa Ionicons `menu`
- `menuItems`: `Inicio`/`home-outline`/`home` · `Búsqueda`/`search-outline`/`noop` · `Mi perfil`/`person-outline`/`noop` · `Historial`/`time-outline`/`noop` · `Configuración`/`open-outline`/`noop`
- Cabecera drawer: avatar `person-outline` + `useAuth().user.name` + `useAuth().user.email` (cero hardcode `Juan Pérez López`). No `AppBrandBar` en el drawer (desviación Humano 2026-09-18 / spec §6.5).
- Pie: `log-out-outline` + `Cerrar sesión` (fuera del array).
- Inicio del menú: outline + `font-lato` (el PNG no usa bold ni icono fill).

**Pasos**

- [x] `src/features/app-shell/presentation/menuItems.ts` (plan §4): array verbatim de arriba; Inicio = `home`; resto = `noop`. Logout **no** va en este array (pie fijo).
- [x] `src/features/app-shell/presentation/AppHeader.tsx` (plan §5.1).
- [x] `src/features/app-shell/presentation/AppBrandBar.tsx` (plan §5.2). Wordmark `Cimientos del Renacimiento`. Solo Inicio.
- [x] `src/features/app-shell/presentation/AppDrawer.tsx` (plan §5.3): overlay 72% / cabecera perfil / BackHandler / pie «Cerrar sesión».
- [x] `src/features/app-shell/presentation/AppShell.tsx` (plan §5.4).
- [x] Solo `Pressable`. Cero `StyleSheet.create` salvo overlay/`absoluteFill`/ancho `%` justificados.
- [x] Estilos **inline JS** con `appPalette` / `palette` / `fontFamily` (precedente NativeWind v5 iOS 1.5a). Documentar en este `task.md` si se usa.
- [x] `npx tsc --noEmit` debe pasar.

**Notas de implementación (Trabajador 2026-09-18):**

- Estilos **inline JS** en los 4 componentes (precedente NativeWind v5 iOS). `StyleSheet` solo para `absoluteFill` + `hairlineWidth`; ancho del panel `"72%"` inline justificado.
- `StatusBar` de `expo-status-bar` v57 **no acepta** `backgroundColor` (error TS2322). Se usó `<StatusBar style="dark" />`; el fondo crema lo pinta el `View` del header.
- `menuItems.map` para los 5 ítems (sin `FlatList`). Inicio y stubs usan el mismo estilo outline + `font-lato`; `noop` es no-op, `home` cierra.
- Cabecera drawer: `useAuth().user.name` / `.email` con ternarios; sin hardcode. No se usa `AppBrandBar` en el drawer (spec §6.5).

**allowed_files**

- `src/features/app-shell/presentation/menuItems.ts`
- `src/features/app-shell/presentation/AppHeader.tsx`
- `src/features/app-shell/presentation/AppBrandBar.tsx`
- `src/features/app-shell/presentation/AppDrawer.tsx`
- `src/features/app-shell/presentation/AppShell.tsx`
- `spec/features/app-shell-menu/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Los 4 componentes + `menuItems` viven en `src/features/app-shell/presentation/`. Nadie los importa aún salvo entre ellos (`AppShell` sí importa header/brand/drawer). Navigator intacto. Cero carpetas domain/application/infrastructure en `app-shell`.

---

## TASK-03 — Wire navigator + quitar logout del placeholder

**Status:** TODO
**assigned_role:** Trabajador
**validation:** pendiente

**Objetivo:** Chrome visible en la raíz autenticada. Logout solo en el menú.

**Pasos**

- [ ] `RootNavigator.tsx`: `headerShown: false`; importar `AppShell` desde `@/features/app-shell/presentation/AppShell`; envolver `AppStack.Navigator` (plan §6). Conservar `NavigationContainer key={status}` y el Auth stack intacto.
- [ ] `HomePlaceholderScreen.tsx`: eliminar `Pressable` «Cerrar sesión» y el import de `signOut` si queda huérfano. Conservar saludo. Fondo `bg-app-crema`.
- [ ] `types.ts` sin rutas nuevas (no editar salvo que tsc lo exija; si no hace falta, no tocarlo).
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/app/navigation/RootNavigator.tsx`
- `src/features/home/presentation/HomePlaceholderScreen.tsx`
- `src/app/navigation/types.ts`
- `spec/features/app-shell-menu/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** App autenticada muestra header+marca+drawer. Placeholder sin logout. Auth stack sin cambios de flujo.

---

## TASK-04 — Arnés

**Status:** TODO
**assigned_role:** Trabajador + Revisor
**validation:** pendiente (Humano en dispositivo tras Revisor)

**Pasos**

- [ ] `npx tsc --noEmit` → exit 0.
- [ ] `npx eslint .` → exit 0 (cero warnings).
- [ ] Grep `src/**/*.ts(x)` + `App.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`.
- [ ] DIP: presentation/navigation/shared-ui sin imports de `infrastructure`; único importador de infra = `compositionRoot.ts`.
- [ ] `git diff -- package.json app.json` vacío.
- [ ] Cero imports a paths 1.5a residuales.

**allowed_files**

- `spec/features/app-shell-menu/task.md`
- `progress/current-task.json`
- `progress/history.md`

Si el arnés falla, correcciones **solo** en archivos de TASK-01…03 (el Humano/Revisor autoriza el allowed_files extra). No “arreglar” auth.

**Definition of done:** CA-06 y CA-07 listos. TASK-04 `READY_FOR_REVIEW`. Fase 2b no abierta.

---

Prohibido planificar Fase 2b (`radar-home`) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 2a (`roadmap.md`).
