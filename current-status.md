el flujo es el siguiente El usuario abre la app y lo primero que ve, si es la primera vez le muestra el screen spec/features/auth-ui-polish/mockups/login-form.png en donde sera obligado a introducir si usuario (correo),  contraseña y presionar el boton iniciar sesion, despues la app detectara que no tiene activa la verificación biométrica y le mostrara el screen spec/features/auth-ui-polish/mockups/biometric-opt-in-request.png que es el encargado de solicitara activar o cancelar el inicio de sesion por cualquier tipo de biométrica que el dispositivo iOS o Android pueda tener activado en ese momento y en caso de activarlo le mostrara el screen spec/features/auth-ui-polish/mockups/biométrico-login.png que lo obligara a usar por primera vez este metodo despues de activarlo y en caso de ser exitoso lo mandara al Inicio (Home) si el usuario no llegase a tener activo ningún tipo de biométrica pues lo mandara al Inicio (Home) directamente. Quiero mencionar que estas pantallas servirán de ejemplo para ajustar el diseño, la funciónalidad ya esta por ejemplo la imagen login-from.png servirá de mockup para  adaptar el LoginScreen.tsx el cual ya es un formulario donde se ingresa el correo y la contraseña, la imagen biometric-opt-in-request.png servirá para adaptar a BiometricUnlockScreen.tsx en cual ya me pregunta si queiro activar el desbloqueo usando Face ID o la huella dependiendo de que metodo este activo y si es que  esta activo por que si el dispositivo no esta activo me lleva directo al inicio (HomePlaceholderScreen.tsx) cabe mencionar que algo que cambiara el flujo sera el screen biometric-login.png por que actualmente la app al iniciar sesion llenando el formulario de login si todo esta bien me envía al screen para preguntarme si queiro activar la biométria para iniciar sesion siempre y cuando este activa esta funcion y no cierre de manera manual la app desde la opcion log-out una vez activada la biométria si cierro la app o la reinicio se active la biométria automáticamente usando el Face ID, codigo o huella para desbloquear la app mostrando el screen BiometricUnlockScreen.tsx activando automáticamente el metodo de desbloqueo biométrico pero en mi nuevo flujo mi idea es que se agregue un nuevo screen para desbloquear la app con la biométria manualmente precionando el boton Inicia sesion como esta definido en mi imagen biometric-login.png pero no se si esto cambia el flujo o debo pedir al orquestador un nuevo plan 

# Instrucción de Arquitectura de Flujo y Mockups para Grok (Fase 1.5a)

## 1. Contexto y Propósito
Las pantallas proporcionadas en la carpeta de mockups (`spec/features/auth-ui-polish/mockups/`) son exclusivamente referencias visuales (*pixel-perfect* y layout) para adaptar componentes que **ya tienen su lógica funcional implementada y probada en la Fase 1**. No se está escribiendo lógica nueva desde cero; solo se están estilizando y ajustando los flujos de interacción existentes.

---

## 2. Problemática Actual: ¿Cómo funciona el flujo hoy en día?
En la implementación funcional actual (Fase 1), el comportamiento al iniciar sesión es el siguiente:
1. El usuario introduce sus credenciales en el formulario de login.
2. Si el login es exitoso, la app evalúa si la función biométrica está disponible, si esta diponible le pregunta al usaurio si desea activarla.
3. Si el usuario la activa lo envia al inicio y si decide que no, tambien lo envia al inicio 
4. Una vez activada esa función, si el usuario cierra la app o la reinicia posteriormente, el sistema salta de forma automática al desbloqueo biométrico (Face ID, código o huella) usando `BiometricUnlockScreen.tsx` sin intervención adicional.

---

## 3. Definición Detallada del Flujo de Autenticación deseado

### Paso A: Ingreso Inicial
1. El usuario abre la app (primer inicio o sesión expirada).
2. Se muestra **`LoginScreen.tsx`** (basado en `login-form.png`).
3. El usuario introduce obligatoriamente su correo y contraseña, y presiona el botón de iniciar sesión.

### Paso B: Verificación de Biometría y Opt-In
1. Tras un login exitoso con credenciales, el sistema detecta si el usuario **aún no tiene activa** la verificación biométrica en la app.
2. Si **sí** tiene hardware biométrico disponible pero no configurado en la app, se muestra la pantalla de solicitud de activación (**`BiometricUnlockScreen.tsx`**, basada en `biometric-opt-in-request.png`), donde puede aceptar o cancelar.
3. Si el dispositivo **no** cuenta con ningún tipo de biometría activa, la app omite este paso y lo manda directamente al **`HomePlaceholderScreen.tsx`** (Inicio).

### Paso C: Activación y Primer Uso Obligatorio (El cambio principal de flujo)
1. Si el usuario **decide activar** la biometría en el paso anterior, el flujo actual cambiaba de forma automática.
2. **Nuevo comportamiento deseado:** Con el nuevo screen representado en `biométrico-login.png`, tras la activación, se obliga al usuario a usar el método biométrico por primera vez de forma manual presionando el botón de inicio de sesión de la pantalla biométrica.
3. Una vez superado este primer uso exitoso, el usuario es enviado al **`HomePlaceholderScreen.tsx`** (Inicio).
4. **El cambio de flujo (El punto a evaluar):** 
   - Anteriormente, al activar la biometría, el flujo automático saltaba directo. 
   - Con la nueva propuesta basada en **`biométrico-login.png`**, el usuario que ya tiene la biometría registrada se enfrentará a una pantalla donde se le obliga a **presionar un botón de inicio de sesión de forma manual** para activar el escaneo biométrico por primera vez en esa sesión, en lugar de que ocurra de forma 100% automatizada tras el login.

---

## 4. Mapeo de Mockups a Componentes Actuales
Con respecto al diseño de las interfaces lara qeu hagan mach aqui esta las equivalencias.
* **`login-form.png`** ➔ Se usa para rediseñar y adaptar el componente **`LoginScreen.tsx`** (formulario donde el usuario ingresa correo y contraseña).
* **`biometric-opt-in-request.png`** ➔ Se usa para rediseñar y adaptar **`BiometricUnlockScreen.tsx`** (pantalla que pregunta si se desea activar Face ID / huella, condicionado a si el hardware del dispositivo lo soporta y tiene biometría configurada).
* **`biométrico-login.png`** ➔ **(Nuevo estado de flujo / pantalla)** Representa la interfaz de acceso manual mediante biometría cuando el usuario decide iniciar sesión usando el método guardado.

---

## 5. Pregunta al Orquestador (Evaluación de Impacto)
Dado que estamos introduciendo la pantalla representada en `biométrico-login.png` para unificar el inicio manual con biometría:
* ¿Este cambio modifica formalmente los contratos o las transiciones de la máquina de estados de autenticación definidos en la Fase 1?
* ¿Debemos solicitar al Orquestador la actualización del archivo `plan.md` de la feature `auth-ui-polish` para registrar esta pantalla de interacción manual, o se puede resolver directamente como un ajuste estético y de transición dentro de una sub fasse por ejemplo Fase 1.5a  para la UI/UI Yy Fase 1.5b para el refactor ubicandolas entre la fase 1 y 2 sin alterar las reglas del orquestador?