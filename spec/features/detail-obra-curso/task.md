# TASK — detail-obra-curso (Fase 4)

> Única lista de archivos que el Trabajador puede tocar. Cada TASK se ejecuta en **nueva sesión** con gate del Humano (patrón 2b/3). `spec.md` = producto; `plan.md` = técnica (firmas verbatim).

**Precondición global:** `spec.md` APROBADA por el Humano. Cero deps nuevas en toda la fase. Cero `npx expo start`/`prebuild`/`run:*` (Humano). Cero commit (lo decide el Humano).

---

## TASK-01 — Tokens `detail-*`

**Status:** COMPLETED
**assigned_role:** Trabajador
**Validación Humana:** diff aprobado (2026-10-20); cierre COMPLETED.

**Pasos**

- [x] `global.css`: añadir los 5 tokens `--color-detail-*` dentro del `@theme` existente, tras los `search-*` (plan §3 verbatim).
- [x] `src/shared/theme/tokens.ts`: añadir `detailPalette` al final (plan §3 verbatim), sin tocar las paletas existentes.
- [x] `npx tsc --noEmit` → exit 0.
- [x] `git diff -- package.json app.json app.config.js` → VACÍO. **Cero instalaciones.**

**allowed_files**

- `global.css`
- `src/shared/theme/tokens.ts`
- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** tokens registrados; tsc en verde; cero deps; cero componentes.

---

## TASK-02 — Domain + Application de detail

**Status:** COMPLETED
**assigned_role:** Trabajador
**Validación Humana:** firmas verbatim, arnés en verde y gate de deps VACÍO aprobados (2026-10-20); cierre COMPLETED.

**Pasos**

- [x] Crear los 5 archivos de `src/features/detail/domain/` (plan §4.1–§4.5 verbatim: `entities/ObraDetail.ts`, `entities/CursoDetail.ts`, `errors/DetailError.ts`, `ports/ObraDetailRepository.ts`, `ports/CursoDetailRepository.ts`).
- [x] Crear los 3 archivos de `src/features/detail/application/` (plan §5.1–§5.3 verbatim: `types.ts`, `obraDetail.ts`, `cursoDetail.ts`).
- [x] `npx tsc --noEmit` → exit 0. `npx eslint .` → exit 0.
- [x] Grep de capas (evidencia en history): domain/application solo imports relativos; cero `react`/`react-native`/`axios`/`@tanstack`/`expo-*`/`react-native-maps`/`@shopify`/`expo-image`/`@/shared`/`@/app`.
- [x] `git diff -- package.json app.json app.config.js` → VACÍO.

**allowed_files**

- `src/features/detail/domain/**`
- `src/features/detail/application/**`
- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** 8 archivos con firmas verbatim; arnés en verde; cero consumidores.

---

## TASK-03 — Infrastructure + compositionRoot + DetailProvider

**Status:** COMPLETED
**assigned_role:** Trabajador
**Validación Humana:** 5 archivos de infrastructure/presentation + 2 edits de wiring validados; DTOs/paths verbatim, DIP correcto, arnés en verde (`npx tsc --noEmit` y `npx eslint .` exit 0), `git diff -- package.json app.json app.config.js` VACÍO y `eslint.config.js` intacto (2026-10-20); cierre COMPLETED.

**Pasos**

- [x] Crear `src/features/detail/infrastructure/dto.ts` (plan §6.1 verbatim; `galeryUrls` sic).
- [x] Crear `src/features/detail/infrastructure/AxiosObraDetailApi.ts` (plan §6.2; path `/api/v1/app-mobile/obra` único; import de `axiosClient` y patrón de cancelación **copiados de `AxiosGlobalSearchApi.ts`**).
- [x] Crear `src/features/detail/infrastructure/AxiosCursoDetailApi.ts` (plan §6.3; path `/api/v1/app-mobile/curso` único; `coverImageUrl` ignorado en el mapper).
- [x] Crear `src/features/detail/presentation/DetailProvider.tsx` y `useDetail.ts` (plan §7.1–§7.2 verbatim).
- [x] Editar `src/app/compositionRoot.ts`: `+createDetailUseCases()` (plan §7.3 verbatim; cero cambios en las factories existentes).
- [x] Editar `App.tsx`: `detailUseCases` a nivel de módulo + `<DetailProvider>` dentro de `<SearchProvider>` (plan §7.4).
- [x] `npx tsc --noEmit` → exit 0. `npx eslint .` → exit 0.
- [x] Grep DIP (evidencia): `detail/infrastructure` importado SOLO por `compositionRoot.ts`; paths de endpoints únicos; `@shopify`/`expo-image`/`react-native-maps` ausentes de domain/application.
- [x] Verificar `eslint.config.js` SIN CAMBIOS (los bans por glob ya cubren a `detail`).
- [x] `git diff -- package.json app.json app.config.js` → VACÍO.

**allowed_files**

- `src/features/detail/infrastructure/**`
- `src/features/detail/presentation/DetailProvider.tsx`
- `src/features/detail/presentation/useDetail.ts`
- `src/app/compositionRoot.ts`
- `App.tsx`
- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** infra + wiring compilando; DIP verificado; cero UI de pantalla; cero deps.

---

## TASK-04 — Componentes del detalle (sin wire al navigator)

**Status:** COMPLETED (aprobada por el Humano 2026-10-20)
**assigned_role:** Trabajador

**Pasos**

- [x] Crear `src/features/detail/presentation/format.ts` (plan §8.1 verbatim).
- [x] Crear `KpiCard.tsx`, `DetailSectionHeading.tsx`, `DetailInfoRows.tsx` (plan §8.2–§8.4).
- [x] Crear `DetailMapCard.tsx` (plan §8.5; pin guinda con el patrón copiado de `RadarMap.tsx`, duplicado deliberado).
- [x] Crear `EvidenceCarousel.tsx` y `EvidenceViewerModal.tsx` (plan §8.6–§8.7; FlashList horizontal SIN `estimatedItemSize`; `expo-image` con `recyclingKey`/`memory-disk`).
- [x] Crear `ObraDetailContent.tsx` y `CursoDetailContent.tsx` (plan §8.8–§8.9; copy y orden de secciones de spec §4.5/§4.6).
- [x] Crear `DetailScreen.tsx` (plan §8.10: dos `useQuery` con `enabled` por `tipo`; back arrow; spinner; error «No se pudo cargar el detalle.»; **SIN** `useHeaderTitle` — eso es TASK-05).
- [x] Editar `src/app/navigation/types.ts`: añadir `Detail: { tipo: "OBRA" | "CURSO"; id: number }` (plan §8.11 verbatim). `RootNavigator` INTACTO.
- [x] `npx tsc --noEmit` → exit 0. `npx eslint .` → exit 0.
- [x] Greps (evidencia): `react-native-maps` solo en `DetailMapCard.tsx`; `expo-image` solo en `EvidenceCarousel.tsx`/`EvidenceViewerModal.tsx`; `@shopify/flash-list` solo en `EvidenceCarousel.tsx`; cero `FlatList`/`estimatedItemSize`/`any`/`TouchableOpacity`/`className` en `detail/presentation`; cero `search-accent`/`auth-*` en `detail/**`.
- [x] `git diff -- package.json app.json app.config.js` → VACÍO.

**allowed_files**

- `src/features/detail/presentation/**` (excepto `DetailProvider.tsx`/`useDetail.ts`, ya creados)
- `src/app/navigation/types.ts`
- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** 11 archivos + `types.ts`; arnés en verde; la pantalla aún NO se ve (sin ruta montada).

---

## TASK-05 — Wire navigator + título dinámico + entradas (features congeladas)

**Status:** COMPLETED (aprobada por el Humano 2026-10-20)
**assigned_role:** Trabajador

**Pasos**

- [x] Crear `src/features/app-shell/presentation/HeaderTitleProvider.tsx` y `useHeaderTitle.ts` (plan §9.1–§9.2 verbatim).
- [x] Editar `AppHeader.tsx` (consume contexto, `{title}` en vez del literal `INICIO`) y `AppShell.tsx` (envuelve con `HeaderTitleProvider`) — plan §9.3–§9.4. Cero otro cambio de píxel.
- [x] Editar `home/presentation/HomeScreen.tsx`: set `INICIO` al foco (plan §9.5).
- [x] Editar `home/presentation/MunicipioCallout.tsx`: `SHOW_SEE_MORE = false` + ternario que oculta el botón «Ver más» (plan §9.8; código intacto).
- [x] Editar `search/presentation/SearchScreen.tsx`: set `BÚSQUEDA` al foco (plan §9.5) + eliminar el `<Text>` del título del cuerpo (plan §9.6; back arrow conservado).
- [x] Editar `search/presentation/SearchResultCard.tsx`: `onPress` navega a `Detail` con `{ tipo: card.tipo, id: card.id }` (plan §9.7; `accessibilityLabel="Ver detalle"`).
- [x] Editar `detail/presentation/DetailScreen.tsx`: añadir set `DETALLE` al foco (plan §9.5). Cero otro cambio.
- [x] Editar `src/app/navigation/RootNavigator.tsx`: import + `<AppStack.Screen name="Detail" ... />` tras `Search` (plan §9.9).
- [x] `npx tsc --noEmit` → exit 0. `npx eslint .` → exit 0.
- [x] `git diff --stat -- src/features/app-shell src/features/home src/features/search` → SOLO los 6 archivos listados (evidencia en history).
- [x] `git diff -- package.json app.json app.config.js` → VACÍO.

**allowed_files**

- `src/features/app-shell/presentation/HeaderTitleProvider.tsx`
- `src/features/app-shell/presentation/useHeaderTitle.ts`
- `src/features/app-shell/presentation/AppHeader.tsx`
- `src/features/app-shell/presentation/AppShell.tsx`
- `src/features/home/presentation/HomeScreen.tsx`
- `src/features/home/presentation/MunicipioCallout.tsx`
- `src/features/search/presentation/SearchScreen.tsx`
- `src/features/search/presentation/SearchResultCard.tsx`
- `src/features/detail/presentation/DetailScreen.tsx`
- `src/app/navigation/RootNavigator.tsx`
- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** wire completo; arnés en verde. **PARADA CONTROLADA (gate Humano):** validación visual en Android + iOS con checklist CA-01…09 (pixel obra/capacitación, navegación por tipo, header dinámico en las 3 pantallas, drawer funcional, formatos, carrusel + visor, mapa interactivo con scroll usable, estados, regresión radar/search/chrome/auth).

---

## TASK-06 — Arnés

**Status:** TODO (desbloqueada; se ejecuta en nueva sesión)
**assigned_role:** Trabajador + Revisor

**Pasos**

- [ ] `npx tsc --noEmit` → exit 0. `npx eslint .` → exit 0, cero warnings.
- [ ] Grep `src/**/*.ts(x)` + `App.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`, paleta `auth-*` fuera de auth, `searchPalette.accent` fuera de `tokens.ts`, `detailPalette` fuera de `detail/**` + `tokens.ts` (excepción permitida: ninguna).
- [ ] DIP: único importador de `detail/infrastructure` = `compositionRoot.ts`; `react-native-maps`/`@shopify/*`/`expo-image` ausentes de domain/application; `react-native-maps` solo en `DetailMapCard.tsx`; `expo-image` solo en `Evidence*`; `@shopify/flash-list` solo en `EvidenceCarousel.tsx`.
- [ ] Deps: `git diff <baseline-pre-Fase-4> -- package.json` → VACÍO; `git diff -- package.json app.json app.config.js` → VACÍO (Fase 4 = cero deps).
- [ ] Contrato: `/api/v1/app-mobile/obra` único en `AxiosObraDetailApi.ts`; `/api/v1/app-mobile/curso` único en `AxiosCursoDetailApi.ts`; `dto.ts` espejo de spec §4.7; `coverImageUrl` no aparece en entidades de dominio.
- [ ] Features congeladas: `git diff --stat <baseline-pre-Fase-4> -- src/features/app-shell src/features/home src/features/search` → SOLO los archivos de TASK-05.
- [ ] `eslint.config.js` sin cambios por la feature.

**allowed_files**

- `spec/features/detail-obra-curso/task.md`
- `progress/current-task.json`
- `progress/history.md`

Si el arnés falla, correcciones **solo** en archivos de TASK-01…05 (el Humano/Revisor autoriza el allowed_files extra). No "arreglar" auth, chrome (fuera de §9), radar ni search (fuera de §9).

**Definition of done:** CA-10 listo; TASK-06 COMPLETED (cierre formal del Humano). Fase 5 no abierta.

---

Prohibido planificar Fase 5 (detalle municipal) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 4 (`roadmap.md`).
