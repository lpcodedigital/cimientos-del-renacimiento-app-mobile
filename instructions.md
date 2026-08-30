**Instrucciones**

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