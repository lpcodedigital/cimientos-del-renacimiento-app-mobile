# SPEC — app-shell-menu

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2a — Chrome autenticado (header + menú hamburguesa)
**Feature:** `app-shell-menu`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** PENDIENTE DE APROBACIÓN HUMANA — cero código RN hasta que el Humano apruebe esta spec
**Fecha:** 2026-09-15

---

## 1. Propósito

Reemplazar el header nativo guinda «INICIO» y el botón «Cerrar sesión» del placeholder por el **chrome pixel-perfect** del mockup: header custom + franja de marca + drawer overlay.

Esta feature **no reabre** Fase 1 / 1.5a / 1.5b. Auth, biometría, DIP, fences ESLint y contratos de login quedan **congelados**. Clean Architecture + SOLID de `tech-stack.md` §5 aplican: 2a vive en `src/features/app-shell/presentation/` (misma semilla que `home/presentation` en 1.5b). **No** se inventa `domain`/`application`/`infrastructure` (no hay puertos ni HTTP).

Fase 2b (`radar-home`) está **bloqueada** hasta que el Revisor audite y el Tester Visual Humano apruebe 2a en dispositivo.

---

## 2. Decisiones del Humano (2026-09-15) — innegociables

1. Reescribir Fase 2 **antes** de código (no hay Fase 2.5 de pulido).
2. El menú es **sub-fase 2a independiente y anterior** al radar (chrome de app, reutilizado en Fases 3–4).
3. Drawer **custom** overlay. Prohibido `@react-navigation/drawer`, `zeego` y Bottom Tabs.
4. Ítems de Fases 3–4 (búsqueda, ficha, listados) si aparecen en el PNG: visibles, `Pressable`, **sin navegar** (no-op).
5. Única acción real nueva: **Cerrar sesión** en el pie del drawer → `signOut` de auth (misma semántica 1.5b).
6. Tipografía: **Lato / Lato Bold**. Wordmark serif del mockup → Lato Bold (misma desviación que 1.5a).
7. Cero dependencias nuevas. Cero `expo-location` / `react-native-maps` / plugin nativo / `app.json`.
8. Paleta `app-*` muestreada del PNG (`tech-stack.md` §2.2). Paleta `auth-*` prohibida aquí.

---

## 3. Entradas y Mockups (Source of Truth visual)

- `spec/features/app-shell-menu/mockups/menu.png` → drawer abierto (cabecera guinda + cuerpo crema + overlay).
- `spec/features/radar-home/mockups/inicio.png` → **solo** el chrome superior (status + título `INICIO` + hamburguesa + franja de marca). El mapa, cards y pines son Fase 2b; en 2a el cuerpo sigue siendo el placeholder.

> **DIRECTRIZ PARA EL TRABAJADOR (ANTI-ALUCINACIÓN):** Tokens = §4. Copy, iconos y cabecera = **§4.5** (transcripción 2026-09-18). Prohibido re-interpretar los PNG ni inventar labels, rutas o un highlight de Inicio que el PNG no muestra.

---

## 4. Tokens visuales exactos

Registrados en `/spec/constitution/tech-stack.md` §2.2. Exponer vía `@theme` en `global.css` + `src/shared/theme/tokens.ts` (`appPalette`).

Mockups ~800×1500 (≈ @2x de un frame ~400×750). El bezel oscuro del PNG **no se replica** (desviación §6).

### 4.1 Header de Inicio (franja superior de `inicio.png`)

- Fondo `app-crema #F2EDE6`.
- `StatusBar` estilo **dark** (contenido oscuro; no `light` de auth).
- Hamburguesa a la izquierda: icono `menu` de `@expo/vector-icons` Ionicons, color `texto #1A1A1A`, hit slop ≥ 44×44.
- Título `INICIO`: `font-lato-bold`, color `texto #1A1A1A`, centrado en la barra.
- Sin header nativo del Native Stack (`headerShown: false`).

### 4.2 Franja de marca (solo Inicio — `inicio.png`)

- Fondo `app-guinda #5C1120`, alto ≈ 44–56 pt bajo el header.
- Wordmark exacto: `Cimientos del Renacimiento` (`font-lato-bold`, `app-gold-wordmark`, centrado).
- **No** se usa como cabecera del drawer (decisión Humano 2026-09-18; ver §4.5 y §6).

### 4.3 Drawer (`menu.png`)

- Ancho ≈ **72%** del ancho de pantalla (panel x≈24–584 de 804). El **28% derecho** es la pantalla de Inicio visible y oscurecida.
- Overlay: `Pressable` a pantalla completa detrás del panel, fondo `app-overlay` (`#000000` opacity 0.45). Tap en overlay **cierra** el drawer. Back nativo Android cierra el drawer si está abierto (no hace `signOut`).
- Cabecera guinda: avatar + `user.name` + `user.email` (no wordmark). Detalle §4.5.
- Cuerpo: `app-crema #F2EDE6`.
- Ítem: icono `app-item-icon #89535B` + label `font-lato text-base text-app-item`. Estado `pressed`: `opacity-80`. El PNG **no** muestra Inicio en bold ni icono relleno: todos los ítems `home-outline` / outline + `font-lato`.
- «Cerrar sesión»: anclado al **pie** (safe area bottom), color `app-logout #B03132`, `font-lato-bold`, icono `log-out-outline`.

### 4.4 Tipografía (chrome)

| Elemento | Tratamiento |
| --- | --- |
| `INICIO` | `font-lato-bold`, `texto #1A1A1A` |
| Wordmark de marca | `font-lato-bold`, `app-gold-wordmark` |
| Ítem de menú (todos, incl. Inicio) | `font-lato`, `app-item` |
| Nombre en cabecera del drawer | `font-lato-bold`, `app-gold-wordmark` |
| Email en cabecera del drawer | `font-lato`, `app-gold-wordmark` (un punto más chico / más tenue que el nombre) |
| Cerrar sesión | `font-lato-bold`, `app-logout` |

### 4.5 Transcripción literal (2026-09-18) — el Trabajador copia esto, no relee el PNG

#### `inicio.png` — solo chrome (ignorar mapa, search, chips, KPI, pines)

1. Header crema: hamburguesa Ionicons `menu` a la izquierda (`palette.texto`, size 28, hit ≥ 44×44, `accessibilityLabel="Abrir menú"`).
2. Título exactamente `INICIO` (mayúsculas, una palabra), `font-lato-bold`, `palette.texto`, centrado en la barra (posición absoluta horizontal).
3. Franja de marca debajo: fondo `app-guinda`. Copy **exacto** del wordmark:

```
Cimientos del Renacimiento
```

(Title Case, no ALL CAPS, no «Gabinete Móvil».) `font-lato-bold`, `appPalette.goldWordmark`, `textAlign: "center"`. Desviación §6: el PNG es serif → Lato Bold.

#### `menu.png` — drawer abierto

**Cabecera del panel (guinda, ≈ 100–110 pt con safe area top). Decisión Humano 2026-09-18: perfil, no `AppBrandBar`.**

- Círculo avatar a la izquierda: borde `app-gold-wordmark`, icono Ionicons `person-outline` color `app-gold-wordmark`. Cero foto de red / `expo-image` en 2a.
- Nombre: `user.name` de `useAuth()` (`font-lato-bold`, `app-gold-wordmark`). El PNG muestra `Juan Pérez López` **solo como ejemplo** del usuario de sesión; **prohibido hardcodear** ese nombre.
- Email: `user.email` de `useAuth()` (`font-lato`, `app-gold-wordmark`). El PNG muestra `juan.perez@yucatan.gob.mx` **solo como ejemplo**; **prohibido hardcodear**.
- Si `user` es `null`: no renderizar string vacío con `&&`; usar ternario (`user?.name ? <Text>…` : null).

**Cuerpo crema — array `menuItems` (logout NO va aquí):**

| id | label (copy exacto) | ionicon | action |
| --- | --- | --- | --- |
| `home` | `Inicio` | `home-outline` | `home` |
| `search` | `Búsqueda` | `search-outline` | `noop` |
| `profile` | `Mi perfil` | `person-outline` | `noop` |
| `history` | `Historial` | `time-outline` | `noop` |
| `settings` | `Configuración` | `open-outline` | `noop` |

Acentos exactos: `Búsqueda`, `Configuración`. No `Busqueda` / `Configuracion`. No añadir ítems (Radar, Obras, Cursos, etc.).

**Pie (fuera del array):**

- Línea divisoria sutil sobre el pie.
- Ionicons `log-out-outline` color `app-logout` + copy exactamente `Cerrar sesión` (`font-lato-bold`, `app-logout`).
- Safe area bottom.

---

## 5. Flujo de usuario

1. Login / biometría exitosos (máquina 1.5b intacta) → raíz `App` → `HomePlaceholder` **dentro** de `AppShell`.
2. Header custom visible. El botón «Cerrar sesión» del placeholder **desaparece**.
3. Tap hamburguesa → drawer se abre (panel izquierdo + overlay). No usar navegación de stack para el menú.
4. Tap **Inicio** o overlay o back Android → cierra drawer. Sigue en Home.
5. Tap ítem stub (Fases 3–4) → feedback `pressed`, **cero** `navigate`. Prohibido `Alert` salvo que el Humano lo pida al aprobar.
6. Tap **Cerrar sesión** → `signOut()` (limpia sesión + `biometric_enabled`, misma semántica 1.5b) → Login.
7. Drawer cerrado es el estado default al montar App.

---

## 6. Desviaciones aprobadas del mockup

1. Wordmark serif/display → **Lato Bold**.
2. Bezel / status bar del sistema del PNG no se pinta; se usa `SafeAreaView` + `StatusBar` nativa dark.
3. Cuerpo de Inicio en 2a = placeholder institucional (sin mapa). El chrome sí empata el PNG.
4. `guinda #6B142E` constitucional no se usa en header/drawer (el mockup es `app-guinda #5C1120`).
5. **Cabecera del drawer (Humano 2026-09-18):** el plan original reutilizaba `AppBrandBar` (wordmark) en el drawer. El PNG muestra avatar + nombre + email. Manda el PNG: perfil vía `useAuth`. `AppBrandBar` **solo** en Inicio bajo el header.

---

## 7. Reglas superseded

| Regla original | Nuevo comportamiento |
| --- | --- |
| Header nativo App «INICIO» guinda (`RootNavigator` 1.5b) | Header custom crema + hamburguesa + título oscuro (`headerShown: false`) |
| `HomePlaceholderScreen` con Pressable «Cerrar sesión» | Logout solo en el drawer |
| Bottom Tabs aplazados a Fase 2 (`auth-biometric` §3) | **Cancelados** en favor del drawer del mockup |

Todo lo no listado permanece intacto (auth, SecureStore, `NavigationContainer key={status}`, DIP, fences).

---

## 8. Arquitectura (2a — feature presentation, sin dominio)

- `src/features/app-shell/presentation/AppShell.tsx` — estado local `drawerOpen`; envuelve el stack autenticado.
- `src/features/app-shell/presentation/AppHeader.tsx` — hamburguesa + `INICIO`.
- `src/features/app-shell/presentation/AppBrandBar.tsx` — franja guinda + wordmark **solo en Inicio**.
- `src/features/app-shell/presentation/AppDrawer.tsx` — overlay + panel 72% + cabecera perfil (`useAuth`) + ítems §4.5 + pie logout.
- `src/features/app-shell/presentation/menuItems.ts` — constantes de presentation (id, label transcrito, icono, `action: 'home' \| 'noop' \| 'sign-out'`). Cero React Navigation routes nuevas.
- `src/app/navigation/RootNavigator.tsx` — **solo** importa `AppShell` y pone `headerShown: false`. No aloja UI del menú.
- `HomePlaceholderScreen` — quitar logout; no importar el drawer.
- `signOut` vía `useAuth` (presentation → presentation de auth). **Prohibido** importar `infrastructure`.
- Cero `src/features/app-shell/{domain,application,infrastructure}/`. Cero barrels `index.ts`. Cero `any`. Solo `Pressable`.

Si NativeWind v5 en iOS no pinta el overlay (precedente 1.5a), usar estilo inline **solo** con `appPalette` / `palette`; documentar en `task.md`.

---

## 9. Límites (qué NO se toca)

**ESTÁ ESTRICTAMENTE PROHIBIDO:**

- GPS, `react-native-maps`, `expo-location`, HTTP de obras/cursos, callouts, KPI card, Ficha (Fase 4).
- Cambiar máquina de estados auth, DTOs login, claves SecureStore, `compositionRoot` (salvo que 2a no lo necesite: **no lo toca**).
- Añadir dependencias, Expo Router, código nativo, `app.json`, `Info.plist`, `AndroidManifest.xml`.
- `TouchableOpacity`, `FlatList`, `any`, emojis, fuentes ≠ Lato, paleta `auth-*`.
- Navegar a pantallas que no existen.
- Correr `npx expo start` (reservado al Humano).

---

## 10. Criterios de Aceptación (CA)

- [ ] **CA-01 (Pixel-diff header):** header custom + franja de marca en Inicio empatan la parte superior de `inicio.png` (desviaciones solo §6).
- [ ] **CA-02 (Pixel-diff drawer):** drawer abierto empata `menu.png` (ancho ~72%, cabecera guinda, ítems, logout rojo, overlay).
- [ ] **CA-03 (Logout):** «Cerrar sesión» en el menú ejecuta `signOut`; el placeholder ya no tiene ese botón; se llega a Login.
- [ ] **CA-04 (Stubs):** ítems no-Inicio no navegan; Inicio/overlay/back cierran el drawer.
- [ ] **CA-05 (Regresión auth):** Login, Opt-In, Unlock, biometría física idénticos a 1.5b.
- [ ] **CA-06 (Arnés):** `npx eslint .` y `npx tsc --noEmit` en verde. Cero `any` / `TouchableOpacity` / `FlatList` / `expo-router`. DIP intacto.
- [ ] **CA-07 (Dependencias):** `package.json` y `app.json` **sin cambios**.

CA-01…05: Tester Visual Humano en iOS + Android. CA-06…07: Revisor.

---

## 11. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` §2.2, §5
- `/spec/constitution/roadmap.md` — Fase 2a
- `/spec/features/core-arch-refactor/spec.md` (baseline de capas)
- `/spec/features/auth-ui-polish/spec.md` (regresión visual auth)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto de 2a. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
