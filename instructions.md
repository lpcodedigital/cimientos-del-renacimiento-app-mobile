**Instrucciones**

## FASE 1 ##

## INSTRUCCIONES PARA AGENTE ORQUESTADOR (MODE PLAN)

## 1. ¿Qué decirle a Grok 4.6? (Copia y pega este prompt)
Quiero inicializar un nuevo proyecto móvil utilizando la arquitectura estricta de Spec-Driven Development (SDD), Ingeniería de Arneses y Multi-Agent Orchestration.

Tu rol principal en esta etapa inicial será el de Agente Orquestador (Lead Planner). Tienes estrictamente prohibido generar código de implementación de React Native en este momento.

1. Contexto del Proyecto:
Nombre: Cimientos del Renacimiento - Gabinete Móvil
Objetivo: App ejecutiva de control político y geolocalización territorial para el Gobernador de Yucatán.
Stack: React Native, Expo SDK, TypeScript estricto, NativeWind.
Ubicación del código: El proyecto de Expo está inicializado en la RAÍZ de este repositorio. Todo el código fuente de componentes, pantallas y navegación debe planificarse estrictamente dentro de la carpeta `/src`.

2. Tu primera directriz obligatoria:
Lee los archivos físicos que ya están en tu espacio de trabajo para sincronizar tu contexto:
- /AGENTS.md (Tus reglas absolutas).
- /spec/constitution/mission.md, tech-stack.md y roadmap.md (La constitución inmutable).
- /progress/current-task.json (Tu memoria de estado a corto plazo).

3. Acciones a ejecutar (Fase 1):
Confirma que has procesado las reglas absolutas, la tipografía estricta Lato y la paleta guinda institucional oficial. Una vez confirmado, ejecuta secuencialmente lo siguiente para iniciar la Fase 1 (Shell Base y Login Híbrido):
1. Genera /spec/features/auth-biometric/spec.md (Definición y criterios de aceptación).
2. Genera /spec/features/auth-biometric/plan.md (Propuesta técnica de arquitectura ubicando los módulos en `/src`).
3. Genera /spec/features/auth-biometric/task.md (Desglose de tareas atómicas para el Agente Trabajador).
4. Modifica /progress/current-task.json cambiando el status a IN_PROGRESS.

Nota: Si tienes alguna duda sobre las APIs modernas de Expo SDK para redactar tu plan técnico, es OBLIGATORIO que utilices tu herramienta MCP context7 para consultar la documentación oficial.

## INSTRUCCIONES PARA EL AGENTE TRABAJADOR TASK-01 (MODE BUILD)

## 2. ¿Qué decirle a DeepSeek? (Copia y pega este prompt)
"Asume el rol de Agente Trabajador siguiendo las reglas absolutas de AGENTS.md.
Sincroniza tu contexto leyendo progress/current-task.json y spec/features/auth-biometric/task.md.
Ejecuta únicamente la TASK-01 desglosada en task.md.
Recuerda que solo tienes permitido modificar los archivos definidos en allowed_files.
Una vez terminada la TASK-01 y verificada con el linter/TypeScript, actualiza el estado correspondiente en progress/current-task.json y avísame para realizar la prueba en el emulador."

"Actúa como Agente Trabajador según @AGENTS.md. Lee el checklist en @spec/features/fase-1-identidad/task.md y ejecuta ÚNICAMENTE la tarea T1. Asegúrate de crear los archivos exactamente donde dice el plan y no toques ninguna otra tarea hasta que apruebe esta."

## ¿Qué va a pasar ahora?
DeepSeek leerá task.md, verá que la TASK-01 requiere hacer el bootstrap de Expo, instalar las dependencias de NativeWind / TypeScript / React Navigation y definir los tokens del tema (/src/theme).
Ejecutará los comandos de instalación o creará los archivos de configuración requeridos dentro de /src.
Al finalizar, te dirá que la TASK-01 está lista.
En ese momento tú podrás ejecutar en tu terminal local npx expo start para verificar que la base de la app arranca sin errores en tu simulador o teléfono, y le darás el pase para la TASK-02 (DTOs y cliente Axios con SecureStore).

## INSTRUCCIONES PARA RESOLVER UN PROBLEMA EN LA TASK 01 LE CORESPONDE AL TRABAJADOR (MODE BUILD)
Ocurrió un error al compilar en iOS/Android durante la validación de TASK-01. Metro lanza una excepción al intentar transformar archivos:

`TypeError: Cannot read properties of undefined (reading 'transformFile')`
`/node_modules/metro/src/Bundler.js (55:30)`

Esto indica una mala configuración o exportación en `metro.config.js` o `babel.config.js` introducida al configurar NativeWind v4 / Expo SDK 57.

Por favor:
1. Revisa `metro.config.js` y `babel.config.js`. Asegúrate de que `getDefaultConfig(__dirname)` se esté importando y ejecutando correctamente, y que la integración con NativeWind (`withNativeWind`) esté exportando la configuración correctamente.
2. Corrige el problema en los archivos de configuración permitidos en TASK-01.
3. Confírmame para volver a reiniciar la caché de Metro (`npx expo start -c`) y probar la compilación.

## INSTRUCCIONES PARA LA SIGUIENTE TAREA TASK-02 (NEW SESSION - BUILD)

En esta nueva sesion asume tu rol de trabajador segun @AGENTS.md . Sincroniza tu contexto leyendo unicamente estos archivos @progress/current-task.json y @spec/features/auth-biometric/task.md y revisa @spec/features/auth-biometric/spec.md (para conocer el contrato exacto de la API para los DTOs) (revisa brevemente el @spec/features/auth-biometric/plan.md si necesitas contxto de la arquitectura de la fase 1). Las TASK-01 de @spec/features/auth-biometric/task.md ya fue completada y validada en dispisitivos. Comienza y ejecuta unicamente con la TASK-02 desglosada en @spec/features/auth-biometric/task.md . Modifica solo los archivos permitidos. Una vez terminada la TASK-02 verifica con linter/Typescript, actualiza el estado correspondiente en @progress/current-task.json y avisame para realizar las pruebas en Android y iOS

## INSTRUCCIONES PARA LA SIGUIENTE TAREA TASK-03 (NEW SESSION - BUILD)

En esta nueva sesion asume tu rol de trabajador segun @AGENTS.md . Sincroniza tu contexto leyendo unicamente estos archivos @progress/current-task.json y @spec/features/auth-biometric/task.md y revisa @spec/features/auth-biometric/spec.md (revisa brevemente el @spec/features/auth-biometric/plan.md si necesitas contexto de la arquitectura de la fase 1). Las TASK-02 de @spec/features/auth-biometric/task.md ya fue completada y validada en dispisitivos. Comienza y ejecuta unicamente con la TASK-03 desglosada en @spec/features/auth-biometric/task.md . Modifica solo los archivos permitidos. Una vez terminada la TASK-03 verifica con linter/Typescript, actualiza el estado correspondiente en @progress/current-task.json y avisame para realizar las pruebas en Android y iOS

## INSTRUCCIONES PARA LA SIGUIENTE TAREA TASK-04 (NEW SESSION - BUILD)

En esta nueva sesion asume tu rol de trabajador segun @AGENTS.md . Sincroniza tu contexto leyendo unicamente estos archivos @progress/current-task.json y @spec/features/auth-biometric/task.md y revisa @spec/features/auth-biometric/spec.md (revisa brevemente el @spec/features/auth-biometric/plan.md si necesitas contexto de la arquitectura de la fase 1). Las TASK-03 de @spec/features/auth-biometric/task.md ya fue completada y validada en dispisitivos. Comienza y ejecuta unicamente con la TASK-04 desglosada en @spec/features/auth-biometric/task.md . Modifica solo los archivos permitidos. Una vez terminada la TASK-04 verifica con linter/Typescript, actualiza el estado correspondiente en @progress/current-task.json y avisame para realizar las pruebas en Android y iOS

## Actualizar el history.md
la TASK-04 fue complepletada con exito, se valido en los dispositivos Android y iOS actualiza el @progress/history.md 

## INSTRUCCIONES PARA LA SIGUIENTE TAREA TASK-05 (NEW SESSION - BUILD)

En esta nueva sesion asume tu rol de trabajador segun @AGENTS.md . Sincroniza tu contexto leyendo unicamente estos archivos @progress/current-task.json y @spec/features/auth-biometric/task.md y revisa @spec/features/auth-biometric/spec.md (revisa brevemente el @spec/features/auth-biometric/plan.md si necesitas contexto de la arquitectura de la fase 1). Las TASK-04 de @spec/features/auth-biometric/task.md ya fue completada y validada en dispisitivos. Comienza y ejecuta unicamente con la TASK-04 desglosada en @spec/features/auth-biometric/task.md . Modifica solo los archivos permitidos. Una vez terminada la TASK-05 verifica con linter/Typescript, actualiza el estado correspondiente en @progress/current-task.json y avisame para realizar las pruebas en Android y iOS

## INSTRUCCIONES PARA LA SIGUIENTE TAREA TASK-06 (NEW SESSION - BUILD)

En esta nueva sesion asume tu rol de trabajador segun @AGENTS.md . Sincroniza tu contexto leyendo unicamente estos archivos @progress/current-task.json y @spec/features/auth-biometric/task.md y revisa @spec/features/auth-biometric/spec.md (revisa brevemente el @spec/features/auth-biometric/plan.md si necesitas contexto de la arquitectura de la fase 1). Las TASK-05 de @spec/features/auth-biometric/task.md ya fue completada y validada en dispisitivos. Comienza y ejecuta unicamente con la TASK-06 desglosada en @spec/features/auth-biometric/task.md . Modifica solo los archivos permitidos. Una vez terminada la TASK-06 verifica con linter/Typescript, actualiza el estado correspondiente en @progress/current-task.json y avisame para realizar las pruebas en Android y iOS

## Actualizar el history.md
la TASK-06 fue complepletada con exito, se valido en los dispositivos Android y iOS unicamente ahora actualiza el @progress/history.md 

## FASE 1.5b ##

## Instrucciones lead planner Kimi K3 Fase1.5a

Usa unicamente por ahora el  @AGENTS.md y todo lo que este en  @spec/ para entrar en contexto, Todas las tareas a nivel funcional y validadas de la Fase 1 que se definio en el @spec/constitution/roadmap.md  esta completa. Teoricamente deberiamos continua con las fase 2 pero necesito hacer un pulido visual en la UI/UX para que la pantalla del login empate con mis mockups los cuales estan en  @spec/features/auth-ui-polish/mockups/ al igual que necesito afinar el flujo de interaccion del login de la app con el usuaro y aplicar un refactor del proyecto pata aplicar buenas practicas + clean arquitecture + proncipios solid para que se mantenible y escalable a largo plazo. pero no se si para esto debe ser tareas adicionales a la fase 1 o debe de ser una  nueva fase consecuitava a la fase 1 por ejemplo 1.5  con sus propias task.md spec.md y plan.md y asi crear  una nueva feature o quiza hacer un ajuste en el plan original y agregarlo  al agents.md, mission.md y tech-stack.md pero no se si esto impacto en lo que ya se logro, . Necesito saber como manejar esta situacion para este proyecto. Con respecto al pulido visual de la UI/UX y el flujo de la app la situacion la tengo @sutuacion-actual.md por favor evitar lecturas innecesarias de carpetas pesadas (`node_modules`, `android`, `ios`, `build`, etc.) solo si es necesario usalo esto con el objetivo de prevenir errores de límite de tokens (*Invalid-argument*). 

## Instruccion worker DeepSeek v4 flash Fase1.5a/task

Rol: Agente Trabajador (Execution Agent). Proyecto: Cimientos del Renacimiento — Gabinete Móvil.

CONTEXTO OBLIGATORIO (lee en este orden, sin excepción):
1. /AGENTS.md
2. /progress/current-task.json (memoria activa: feature auth-ui-polish, TASK-01 TODO)
3. /spec/constitution/tech-stack.md (especialmente §2.1 paleta auth-* y §gradientes)
4. /spec/features/auth-ui-polish/spec.md
5. /spec/features/auth-ui-polish/plan.md
6. /spec/features/auth-ui-polish/task.md

TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-01 (Tokens auth + expo-linear-gradient + verificación de asset) descrita en spec/features/auth-ui-polish/task.md.

REGLAS ESTRICTAS:
- SOLO puedes editar los archivos listados en allowed_files de TASK-01: package.json, lockfile, global.css, src/theme/tokens.ts, progress/current-task.json.
- Instala expo-linear-gradient EXCLUSIVAMENTE con `npx expo install expo-linear-gradient`. Nunca `npm i`. Cero otras dependencias.
- Los 15 tokens --color-auth-* van dentro del @theme existente en global.css (plan §2.2). NO toques los tokens de Fase 1 ni tailwind configs.
- En src/theme/tokens.ts solo AÑADES authPalette (incluyendo btnText: "#2D0A14"); no modifiques palette ni fontFamily (plan §2.3).
- Verifica que exista assets/images/escudo-yucatan.png (el Humano ya lo colocó). Repórtalo en agent_notes.
- Ejecuta `npx tsc --noEmit` al finalizar; debe pasar en verde. NO ejecutes `npx expo start` (prohibido para agentes).
- Cero any, cero TouchableOpacity, cero StyleSheet.create, cero código nativo.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar TASK-01: no marca sus checkboxes `- [x]` y `Status: COMPLETED` en spec/features/auth-ui-polish/task.md.
- No Actualizes el progress/current-task.json: active_task.status = "READY_FOR_HUMAN_VALIDATION" (NO avances el puntero a TASK-02), registra harness_status con el resultado del typecheck y no escribas agent_notes detallando lo hecho.
- no Añadas una entrada en progress/history.md bajo la sección Fase 1.5a.
- TE DETIENES AHÍ. Tienes TERMINANTEMENTE PROHIBIDO iniciar TASK-02 o cualquier otra task hasta que el Humano valide visualmente TASK-01 y te lo indique explícitamente en esta sesión. Unicamente vas a actulizar todo lo que este relacionado con el progress hasta que de por concluida la TASK actual

Al finalizar, respóndeme con: (1) lista exacta de archivos modificados, (2) salida del typecheck, (3) qué debo validar yo como Humano antes de autorizar TASK-02.

## Instruccion worker DeepSeek v4 flash Fase1.5a/task 02

Rol: Agente Trabajador (Execution Agent). Proyecto: Cimientos del Renacimiento — Gabinete Móvil.

CONTEXTO OBLIGATORIO (lee en este orden, sin excepción):
1. /AGENTS.md
2. /progress/current-task.json (memoria activa: feature auth-ui-polish, TASK-02 TODO, puntero ya avanzado a TASK-02)
3. /progress/history.md (ver entrada «2026-09-04 — TASK-01 APROBADA»)
4. /spec/constitution/tech-stack.md (§2.1 paleta auth-*, §gradientes expo-linear-gradient)
5. /spec/features/auth-ui-polish/spec.md
6. /spec/features/auth-ui-polish/plan.md (especialmente §5 Components UI)
7. /spec/features/auth-ui-polish/task.md (sección TASK-02)

TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-02 (Componentes UI del sistema auth oscuro) descrita en spec/features/auth-ui-polish/task.md. TASK-01 ya fue validada por el Humano y está COMPLETED.

REGLAS ESTRICTAS:
- Crea los 4 componentes: src/components/ui/AuthScaffold.tsx (gradiente vertical full-screen con expo-linear-gradient + authPalette, <StatusBar style="light" />, SafeAreaView, children — plan §5.1), GoldButton.tsx + GoldButtonText (compound; gradiente horizontal goldGradStart→goldGradEnd, h-14 rounded-full, estados pressed opacity-80 / disabled opacity-40 / loading con ActivityIndicator color authPalette.btnText; SOLO Pressable — plan §5.2), BiometricMethodCard.tsx (card no interactiva View; clases bg-auth-card-active border-auth-dorado seleccionada / bg-auth-card-inactive border-transparent no seleccionada; checkmark @expo/vector-icons Ionicons checkmark-circle color auth-dorado; plan §5.3), TextField.tsx (restyle oscuro: label uppercase taupe, input bg-auth-surface border-auth-surface-border rounded-2xl, foco focus:border-auth-dorado, error border-error; nueva prop opcional secureToggle con Pressable de iconos eye/eye-off Ionicons color taupe — plan §5.4).
- Solo usar tokens auth-* del authPalette en tokens.ts y clases NativeWind derivadas de los 15 tokens; CERO colores inventados.
- Consumir authPalette desde src/theme/tokens.ts (ya incluye btnText "#2D0A14").
- Cero any, cero TouchableOpacity, cero FlatList, cero StyleSheet.create (salvo valor dinámico que lo exija; los gradientes usan props, no StyleSheet), cero emojis en UI, solo fuentes Lato.
- SOLO puedes crear/editar los archivos listados en allowed_files de TASK-02 (los 4 componentes .tsx).
- NO toques global.css, tokens.ts, api.ts, dto.ts, tokenStore.ts ni archivos de otras tasks (ya están congelados/avanzados).
- Instalación: expo-linear-gradient YA instalada; NO instales ninguna otra dependencia en TASK-02.
- Ejecuta npx tsc --noEmit; debe pasar en verde. NO ejecutes npx expo start.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar TASK-02: no marca sus checkboxes `- [x]` y `Status: COMPLETED` en spec/features/auth-ui-polish/task.md.
- No Actualizes el progress/current-task.json: active_task.status = "READY_FOR_HUMAN_VALIDATION" (NO avances el puntero a TASK-03), registra harness_status con el resultado del typecheck y no escribas agent_notes detallando lo hecho.
- no Añadas una entrada en progress/history.md bajo la sección Fase 1.5a.
- TE DETIENES AHÍ. Tienes TERMINANTEMENTE PROHIBIDO iniciar TASK-03 o cualquier otra task hasta que el Humano valide visualmente TASK-02 y te lo indique explícitamente en esta sesión. Unicamente vas a actulizar todo lo que este relacionado con el progress hasta que de por concluida la TASK actual

Al finalizar, respóndeme con: (1) lista exacta de archivos modificados, (2) salida del typecheck, (3) qué debo validar yo como Humano antes de autorizar TASK-03.

## Instruccion worker DeepSeek v4 flash Fase1.5a/task 03

CONTEXTO OBLIGATORIO (lee en este orden, sin excepción):
1. /AGENTS.md
2. /progress/current-task.json (memoria activa: feature auth-ui-polish, TASK-02 COMPLETED y APROBADA por el Humano; el puntero activo sigue en TASK-02 y el estado cierra TASK-02. Avanza el puntero a TASK-03.)
3. /progress/history.md (entradas del 2026-09-04 «TASK-01 APROBADA» y «TASK-02 APROBADA por el Humano»)
4. /spec/constitution/tech-stack.md (§2.1 paleta auth-*, §gradientes expo-linear-gradient)
5. /spec/features/auth-ui-polish/spec.md
6. /spec/features/auth-ui-polish/plan.md (§2.3 authPalette, §2.4 escudo, §5 componentes UI, §6.1 LoginScreen)
7. /spec/features/auth-ui-polish/task.md (sección TASK-03; TASK-01 y TASK-02 ya COMPLETED y validadas por el Humano)

TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-03 (LoginScreen pixel-perfect contra login-form.png) descrita en spec/features/auth-ui-polish/task.md.

REGLAS ESTRICTAS:
- SOLO editar los archivos listados en allowed_files de TASK-03:
  - src/screens/auth/LoginScreen.tsx (reescritura según plan §6.1: AuthScaffold + KeyboardAvoidingView + ScrollView, título de marca Lato Bold crema, escudo con Image de assets/images/escudo-yucatan.png resizeMode contain accessibilityLabel "Escudo del Gobierno del Estado de Yucatán" — o placeholder View w-28 h-32 rounded-2xl border border-auth-dorado/40 si el asset no existe: reportarlo, no generarlo, plan §2.4 —, TextField dark con secureToggle en contraseña, link «¿Olvidaste tu contraseña?» Pressable → Alert institucional, GoldButton "INICIAR SESIÓN" con loading, error de dominio estilo §5.4, y sección condicional divisor + botón "Acceso biométrico" con Ionicons "scan" visible solo si canUseBiometricLogin → navegar a BiometricUnlock; usar ternarios/!! nunca `&&` suelto)
  - src/features/auth/AuthProvider.tsx (ÚNICAMENTE el selector live canUseBiometricLogin: boolean, calculado en bootstrap y tras signOut, default false)
  - src/features/auth/useAuth.ts (solo tipo/selector canUseBiometricLogin)
  - assets/images/escudo-yucatan.png (SOLO si el Humano ya lo colocó; el Trabajador NO lo genera)
- Eliminar de la UI la caja «Prueba local: demo@cdr.mx / demo1234». NO tocar api.ts (el login demo permanece).
- Conservar intactos: EMAIL_PATTERN, canSubmit, fase idle|submitting, mapeo de errores de dominio.
- navigation/types.ts + RootNavigator.tsx sin cambios de rutas en esta task; LoginScreen obtiene navigation vía prop tipada NativeStackScreenProps<AuthStackParamList, "Login">.
- Cero any, cero TouchableOpacity, cero FlatList, cero StyleSheet.create injustificado, cero emojis UI, solo fuentes Lato.
- Deja congelados: global.css, tokens.ts, api.ts, dto.ts, tokenStore.ts y archivos de otras tasks.
- Ya instaladas: expo-linear-gradient (~57.0.1) y @expo/vector-icons (^15.0.2, desviación autorizada en TASK-02). NO instales otras dependencias en TASK-03.
- Ejecuta `npx tsc --noEmit`; debe pasar en verde. NO ejecutes npx expo start.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar TASK-03: no marca sus checkboxes `- [x]` y `Status: COMPLETED` en spec/features/auth-ui-polish/task.md.
- No Actualizes el progress/current-task.json: active_task.status = "READY_FOR_HUMAN_VALIDATION" (NO avances el puntero a TASK-04), registra harness_status con el resultado del typecheck y no escribas agent_notes detallando lo hecho.
- no Añadas una entrada en progress/history.md bajo la sección Fase 1.5a.
- TE DETIENES AHÍ. Tienes TERMINANTEMENTE PROHIBIDO iniciar TASK-04 o cualquier otra task hasta que el Humano valide visualmente TASK-03 y te lo indique explícitamente en esta sesión. Unicamente vas a actulizar todo lo que este relacionado con el progress hasta que de por concluida la TASK actual

Al terminar, respóndeme con: (1) lista exacta de archivos modificados, (2) salida del typecheck, (3) qué debo validar yo como Humano (pixel-diff login vs login-form.png, CanSubmit/errores, secureToggle, escudo, divisor biométrico) antes de autorizar TASK-04.

## Instruccion worker DeepSeek v4 flash Fase1.5a/task 04 

CONTEXTO OBLIGATORIO (léelo en este orden, sin excepción):
1. /AGENTS.md
2. /progress/current-task.json (memoria activa: feature auth-ui-polish, TASK-04 es el puntero activo, status TODO; TASK-01..03 COMPLETED y aprobadas por el Humano)
3. /progress/history.md (entradas del 2026-09-04/05: TASK-01, TASK-02, y «TASK-03 APROBADA por el Humano» con las correcciones de TASK-02 escaladas: AuthScaffold/GoldButton reescritos a estilos inline JS por el pruning de NativeWind en iOS)
4. /spec/constitution/tech-stack.md (§2.1 paleta auth-*, §gradientes expo-linear-gradient, §5 Clean Architecture prohibido hasta 1.5b)
5. /spec/features/auth-ui-polish/spec.md
6. /spec/features/auth-ui-polish/plan.md (§3 máquina de estados, §4 navegación, §6.2 BiometricOptInScreen)
7. /spec/features/auth-ui-polish/task.md (sección TASK-04; TASK-01..03 COMPLETED y aprobadas)
TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-04 descrita en spec/features/auth-ui-polish/task.md.
REGLAS ESTRICTAS:
- SOLO editar los archivos en allowed_files de TASK-04:
- src/features/auth/biometricService.ts (añadir confirmBiometricOptIn() y getSupportedBiometricMethods() + tipo BiometricMethodKind; NO modificar authenticateWithResult ni getBiometricAvailability)
- src/features/auth/AuthProvider.tsx (plan §3: añadir status biometric_opt_in, BiometricUnlockMode auto|manual, transiciones signIn/enableBiometricAfterLogin/declineBiometricOptIn; eliminar shouldOfferBiometricOptIn, biometricEnrollHint, dismissBiometricOptIn; conservar canUseBiometricLogin añadido en TASK-03)
- src/features/auth/useAuth.ts (sincronizar interfaz, añadir biometricUnlockMode)
- src/navigation/types.ts (añadir BiometricOptIn: undefined)
- src/navigation/RootNavigator.tsx (registrar screen + mapear ruta inicial biometric_opt_in)
- src/screens/auth/BiometricOptInScreen.tsx (nueva pantalla segun plan §6.2)
- src/screens/app/HomePlaceholderScreen.tsx (solo ajuste mínimo si consume campos eliminados)
- IMPORTANTE INTEGRACIÓN: dado el pruning de NativeWind descubierto en TASK-02/03 (los className de archivos nuevos no se aplican en iOS), aplica ESTILOS INLINE JS en los archivos/screens nuevos (especialmente BiometricOptInScreen). Reutiliza AuthScaffold (ya inline), GoldButton/GoldButtonText (inline), BiometricMethodCard y TextField (evaluar si requieren misma corrección). Valida con tsc y describe cualquier componente que deba migrarse igual.
- Conserva la ruta y semántica biométrica de Fase 1; NO toques api/dto/tokenStore ni raíces Auth|App. Cero any/TouchableOpacity/FlatList/expo-router/emojis. npx expo run y expo start PROHIBIDOS a agentes.
- Ejecuta npx tsc --noEmit; debe pasar en verde.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar TASK-04: no marca sus checkboxes `- [x]` y `Status: COMPLETED` en spec/features/auth-ui-polish/task.md.
- No Actualizes el progress/current-task.json: active_task.status = "READY_FOR_HUMAN_VALIDATION" (NO avances el puntero a TASK-05), registra harness_status con el resultado del typecheck y no escribas agent_notes detallando lo hecho.
- no Añadas una entrada en progress/history.md bajo la sección Fase 1.5a.
- TE DETIENES AHÍ. Tienes TERMINANTEMENTE PROHIBIDO iniciar TASK-05 o cualquier otra task hasta que el Humano valide visualmente TASK-04 y te lo indique explícitamente en esta sesión. Unicamente vas a actulizar todo lo que este relacionado con el progress hasta que de por concluida la TASK actual

Al terminar, respóndeme con: (1) lista exacta de archivos modificados, (2) salida del typecheck, (3) qué debo validar yo como Humano (pixel-diff login vs login-form.png, CanSubmit/errores, secureToggle, escudo, divisor biométrico) antes de autorizar TASK-05.

## Instruccion worker DeepSeek v4 flash Fase1.5a/task 05 

spec/features/auth-ui-polish/task.md (sección TASK-05; TASK-01..04 COMPLETED y aprobadas
por el Humano 2026-09-05, incluyendo la BiometricOptInScreen visual 10/10).

TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-05 descrita en
spec/features/auth-ui-polish/task.md.

REGLAS ESTRICTAS:
- SOLO editar src/screens/auth/BiometricUnlockScreen.tsx (único allowed_file de TASK-05).
- Reescribir la pantalla según plan §6.3 DENTRO de AuthScaffold: AuthScaffold + header
  Pressable «< Volver» → signOut (fallback que limpia sesión), título de marca
  «Cimientos del Renacimiento» (Lato Bold, text-auth-crema), escudo de Yucatán
  (w-40, centered, resizeMode contain, Image), cuerpo «Utilice su método biométrico
  para acceder» (text-auth-taupe), error de desbloqueo si existe (text-error),
  GoldButton «INICIAR SESIÓN» (loading = pending) → unlockWithBiometrics.
- LEER en el provider el modo con useAuth(): const { biometricUnlockMode } =
  useAuth(). Auto-prompt (efecto setTimeout 500 ms, una sola vez con ref) SOLO cuando
  biometricUnlockMode === "auto". En "manual" el prompt salta ÚNICAMENTE al presionar
  el botón. Conservar handleUnlock actual (errores de dominio, pending, ref
  anti-duplicado) para no reintentar doble prompt.
- CONTEXTO DE INTEGRACIÓN (bug confirmado en físico): la pantalla heredada auto-promputea
  incondicional e iOS bloquea el segundo authenticateAsync encadenado justo tras
  ACTIVAR/OptIn y tras re-login con biometría activa → quedaba colgada hasta reiniciar.
  TASK-05 corrige esto respetando "manual": tras ACTIVAR (primer uso) y tras re-login con
  biometría ya activa el provider entrega status=needs_biometric con mode="manual", así
  que NO debe dispararse auto-prompt y el Home llega solo al presionar INICIAR SESIÓN.
- IMPORTANTE INTEGRACIÓN NativeWind en iOS: los className de archivos NUEVOS no se aplican
  en iOS. Aplica ESTILOS INLINE JS en toda la pantalla (igual que AuthScaffold/GoldButton
  y BiometricOptInScreen ya migrados). Reutiliza AuthScaffold y GoldButton/GoldButtonText
  (ya inline). Describe cualquier componente className-based que deba migrarse igual.
- NO toques raíces Auth|App, api/dto/tokenStore, ni AuthProvider/useAuth ya entregados en
  TASK-04. Cero any/TouchableOpacity/FlatList/expo-router/emojis.
- npx expo run / expo start PROHIBIDOS a agentes.
- Ejecuta npx tsc --noEmit; debe pasar en verde.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar TASK-05: no marca sus checkboxes `- [x]` y `Status: COMPLETED` en spec/features/auth-ui-polish/task.md.
- No Actualizes el progress/current-task.json: active_task.status = "READY_FOR_HUMAN_VALIDATION" (NO avances el puntero a TASK-06), registra harness_status con el resultado del typecheck y no escribas agent_notes detallando lo hecho.
- no Añadas una entrada en progress/history.md bajo la sección Fase 1.5a.
- TE DETIENES AHÍ. Tienes TERMINANTEMENTE PROHIBIDO iniciar TASK-06 o cualquier otra task hasta que el Humano valide visualmente TASK-05 y te lo indique explícitamente en esta sesión. Unicamente vas a actulizar todo lo que este relacionado con el progress hasta que de por concluida la TASK actual

Al terminar respóndeme: (1) archivos modificados, (2) salida del typecheck,
(3) qué debo validar yo como Humano antes de autorizar TASK-06.

## Instruccion worker DeepSeek v4 flash Fase1.5a/task 06 

spec/features/auth-ui-polish/task.md (sección TASK-06; TASK-01..05 COMPLETED y aprobadas por el Humano
2026-09-05, incluyendo: TASK-05 BiometricUnlockScreen pixel-perfect visual 10/10 vs biometric-login.png,
modos auto/manual funcionando en físico iOS+Android, y el fix de navegación en vivo en RootNavigator
con <NavigationContainer key={status}> que pasa de BiometricOptInScreen a BiometricUnlockScreen modo
manual tras ACTIVAR).

TAREA ASIGNADA: ejecutar ÚNICAMENTE la TASK-06 descrita en spec/features/auth-ui-polish/task.md
(Fase 1.5a — Arnés de control).

REGLAS ESTRICTAS:
- Ejecutar `npx eslint .` y `npx tsc --noEmit`. Corregir SOLO archivos de TASK-01..05 (sin refactors de
  alcance). No editar raíces Auth|App, api/dto/tokenStore, ni AuthProvider/useAuth.
- NO ejecutar `npx expo start` (prohibido a agentes; el bundling en físico lo hace el Humano).
- PENDIENTE DE LINT CONOCIDO (TASK-05): en `src/screens/auth/BiometricUnlockScreen.tsx` (~línea 106) el
  asset del escudo se carga con `require(...)` público y eslint lo rechaza
  (`@typescript-eslint/no-require-imports` está off solo en `App.tsx`/configs). LoginScreen (TASK-03)
  usa el mismo patrón y quedó aprobado por el Humano. Decide la estrategia de TASK-06 sin romper las
  fuentes de asset (p. ej. definir la imagen como import/const en un módulo .ts estilo `@/assets`
  reutilizable por Login y Unlock) y déjalo en verde en ambbos archivos.
- Verificar bans (rg sobre .ts/.tsx): cero `any` público, cero `TouchableOpacity`, cero `FlatList`,
  cero imports de `expo-router`, cero emojis en UI auth, cero `StyleSheet.create` injustificado.
  Nota: `@expo/vector-icons` y `expo-linear-gradient` fueron autorizados como dependencias de la Fase 1.5a.
- Verificar por diff: `api.ts`, `dto.ts`, `tokenStore.ts`, `app.json` sin cambios; única dependencia
  nueva de la Fase = `expo-linear-gradient` (+ `@expo/vector-icons` autorizado).
- Actualizar `progress/current-task.json`: `harness_status` con resultado real de eslint+tsc,
  `active_task` TASK-06 `status: READY_FOR_REVIEW` (NO avanzar a otra task/fase).
- Añadir entrada de cierre en `progress/history.md` bajo la sección Fase 1.5a.
- Marca checkboxes `- [x]` y `Status: COMPLETED` de TASK-06 en spec/features/auth-ui-polish/task.md.
- TE DETIENES AHÍ al terminar: NO inicies Fase 1.5b ni la auditoría del Revisor por tu cuenta; reporta
  para que el Revisor re-ejecute el arnés y el Humano haga pixel-diff (CA-01..03), valide flujos
  (CA-04..08) y pruebe Face ID/huella en físico.

Al terminar respóndeme: (1) archivos modificados/corregidos, (2) salida de `npx eslint .` y
`npx tsc --noEmit`, (3) resultado de la verificación de bans e invariantes por diff, (4) qué debo
validar yo como Humano antes de autorizar la Fase 1.5b (pixel-diff, flujos y biometría física).