# PLAN — app-shell-menu

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2a — Chrome autenticado
**Feature:** `app-shell-menu`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** LISTO PARA EL TRABAJADOR **solo cuando el Humano apruebe `spec.md` y autorice TASK-01**
**Fecha:** 2026-09-15

> Fuente de verdad técnica. Cero paquetes nuevos. Cero código nativo. Cero GPS/mapas/HTTP de obras. Cero dominio de menú.

---

## 1. Hallazgos de repositorio (baseline 1.5b)

Verificado por el Orquestador el 2026-09-15:

- `RootNavigator.tsx`: Native Stack autenticado con **header nativo** guinda, título `INICIO`, pantalla única `HomePlaceholder`.
- `HomePlaceholderScreen.tsx`: saludo + copy de radar aplazado + `Pressable` «Cerrar sesión» → `signOut`.
- `useAuth` / `AuthProvider` en presentation; `compositionRoot.ts` solo cablea auth.
- Fences ESLint `no-restricted-imports` en domain / application / presentation+navigation+shared-ui. `compositionRoot.ts` y `App.tsx` fuera de los globs.
- `@expo/vector-icons` ya instalado. `expo-location` y `react-native-maps` **no** están en `package.json`.
- NativeWind v5 + tokens en `global.css` `@theme`. Precedente 1.5a: gradientes auth en inline JS.

---

## 2. Árbol destino (2a)

```
src/shared/theme/tokens.ts                         # + appPalette
global.css                                         # + --color-app-*

src/features/app-shell/presentation/menuItems.ts
src/features/app-shell/presentation/AppHeader.tsx
src/features/app-shell/presentation/AppBrandBar.tsx
src/features/app-shell/presentation/AppDrawer.tsx
src/features/app-shell/presentation/AppShell.tsx

src/app/navigation/types.ts                        # sin rutas nuevas
src/app/navigation/RootNavigator.tsx               # headerShown:false; importa AppShell

src/features/home/presentation/HomePlaceholderScreen.tsx  # sin logout
```

Prohibido tocar `src/features/auth/**`, `src/app/compositionRoot.ts`, `App.tsx` (salvo que StatusBar global choque: **no**; StatusBar dark va en `AppHeader`/`AppShell` igual que auth pone `light` en `AuthScaffold`).

Prohibido `index.ts` barrels.

---

## 3. Tokens (TASK-01)

### 3.1 `global.css` — añadir dentro de `@theme` existente (no borrar auth ni Fase 1)

```css
--color-app-crema: #f2ede6;
--color-app-guinda: #5c1120;
--color-app-gold-wordmark: #f0ddb3;
--color-app-item: #333333;
--color-app-item-icon: #89535b;
--color-app-logout: #b03132;
```

Overlay no es clase de color sólido: `style={{ backgroundColor: "rgba(0,0,0,0.45)" }}` (valor dinámico de opacidad; justificado vs NativeWind).

### 3.2 `src/shared/theme/tokens.ts`

Añadir **sin modificar** `palette`, `fontFamily`, `authPalette`:

```ts
export const appPalette = {
  crema: "#F2EDE6",
  guinda: "#5C1120",
  goldWordmark: "#F0DDB3",
  item: "#333333",
  itemIcon: "#89535B",
  logout: "#B03132",
  overlay: "rgba(0,0,0,0.45)",
} as const;
```

Cero dependencias nuevas. `package.json` / `app.json` intactos.

---

## 4. `menuItems.ts` (TASK-02)

Array constante. Labels e iconos **transcritos del PNG** (`menu.png`). Forma:

```ts
export type AppMenuAction = "home" | "noop" | "sign-out";

export type AppMenuItem = {
  id: string;
  label: string;
  ionicon: string; // nombre Ionicons existente en @expo/vector-icons
  action: AppMenuAction;
};
```

Reglas:

- El ítem que corresponda a Inicio: `action: "home"`.
- El ítem de cierre de sesión: `action: "sign-out"` (puede vivir fuera del array y renderizarse fijo al pie; preferible pie fijo para empatar el mockup).
- Cualquier otro: `action: "noop"`.
- Prohibido `navigation.navigate` a rutas inexistentes.

---

## 5. Componentes (TASK-02)

### 5.1 `AppHeader`

- Fondo `app-crema`, padding top = safe area.
- Fila `h-12` (o la altura que empate el PNG): `Pressable` hamburguesa (Ionicons `menu`, color `palette.texto`, size 28) a la izquierda; `Text` «INICIO» `font-lato-bold` centrado (posición absoluta horizontal para no desplazarlo el icono).
- `StatusBar` `style="dark"` `backgroundColor={appPalette.crema}` (Android).
- `accessibilityLabel="Abrir menú"` en la hamburguesa.

### 5.2 `AppBrandBar`

- `View` fondo `app-guinda`, padding vertical que empate el PNG (~44–56 pt en Inicio; en el drawer la cabecera incluye esta franja + safe area si el drawer pinta su propio top).
- `Text` wordmark transcrito, `font-lato-bold`, `color: appPalette.goldWordmark`, `textAlign: "center"`.
- Usado en Inicio (debajo del header) **y** como cabecera del drawer.

### 5.3 `AppDrawer`

Props: `{ open: boolean; onClose: () => void; onSignOut: () => void }`.

- Si `!open` → `return null`.
- `View` `StyleSheet.absoluteFill` + `zIndex` alto (el overlay cubre header y cuerpo).
- Overlay `Pressable` flex 1 con `appPalette.overlay` → `onClose`.
- Panel izquierdo `width: "72%"` fondo `app-crema`, `AppBrandBar` arriba, lista de ítems (`Pressable` + Ionicons + Text), logout al pie con `SafeAreaView` edges bottom.
- Android: `BackHandler` en un `useEffect` si `open` → `onClose` y `return true`.

Ítem:

- `home` → `onClose()`.
- `noop` → no-op (el `Pressable` igual da opacity).
- pie logout → `onSignOut()`.

### 5.4 `AppShell`

```ts
export function AppShell({ children }: { children: React.ReactNode }) {
  // drawerOpen state
  // useAuth().signOut
  // View flex-1 bg-app-crema
  // AppHeader onMenuPress → set true
  // AppBrandBar
  // View flex-1 {children}
  // AppDrawer
}
```

No usar React Context nuevo si con estado local basta (SRP: el shell posee el drawer).

---

## 6. Navegación (TASK-03)

`AppStackNavigator`:

```ts
screenOptions={{ headerShown: false }}
```

Eliminar `headerStyle` / `headerTintColor` / `headerTitleStyle` guinda.

Importar `AppShell` desde `@/features/app-shell/presentation/AppShell`. Envolver:

```ts
<AppShell>
  <AppStack.Navigator ...>
    <AppStack.Screen name="HomePlaceholder" component={HomePlaceholderScreen} />
  </AppStack.Navigator>
</AppShell>
```

`types.ts`: sin cambios de rutas.

`HomePlaceholderScreen`: borrar el `Pressable` de logout. Conservar saludo y copy de radar aplazado (el mapa es 2b). Fondo del cuerpo: `app-crema` o `fondo` — usar `bg-app-crema` para no contrastar con el header.

---

## 7. Invariantes 1.5b (no romper)

- `NavigationContainer key={status}`.
- Auth stack `headerShown: false` intacto.
- `compositionRoot.ts` intacto.
- Cero imports de `infrastructure` desde navigation/presentation.
- Cero `any` / `TouchableOpacity` / `FlatList` / `expo-router`.

---

## 8. Orden de tasks

1. TASK-01 tokens (`global.css` + `tokens.ts`) + tsc.
2. TASK-02 `menuItems` + `AppHeader` + `AppBrandBar` + `AppDrawer` + `AppShell` bajo `src/features/app-shell/presentation/` (aún no cableados al navigator). Preferencia: crear los 4 componentes en TASK-02 **sin** editar `RootNavigator` todavía, para diffs quirúrgicos.
3. TASK-03 wire `RootNavigator` + quitar logout del placeholder.
4. TASK-04 arnés `eslint` + `tsc` + grep bans + diff `package.json`/`app.json` limpio.

PARADA entre tasks: el Trabajador no encadena TASK-02 si TASK-01 no está COMPLETED y el puntero en `current-task.json` no lo autoriza el Humano en esa sesión (mismo ritual 1.5b).

---

## 9. Fuera de este plan

Fase 2b: mapas, location, DTOs `ObraMapaDTO` / `CursoMapaDTO`, callout, KPI slot. No se redacta `plan.md` de 2b aquí.
