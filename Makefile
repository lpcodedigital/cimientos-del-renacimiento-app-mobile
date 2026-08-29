# ==============================================================================
# MAKEFILE - EXPO SDK 57 DEVELOPMENT WORKFLOW
# ==============================================================================

.PHONY: help env-setup init prebuild patch pods run-android run-ios clean start

help:
	@echo "Comandos disponibles:"
	@echo "  make env-setup   - Configura dependencias del sistema (CocoaPods/Homebrew)"
	@echo "  make init        - Inicializa las dependencias clave de Expo y Dev Client"
	@echo "  make prebuild    - Genera las carpetas nativas /android e /ios"
	@echo "  make patch       - Genera/aplica los parches con patch-package"
	@echo "  make pods        - Instala y actualiza las dependencias Pods de iOS"
	@echo "  make start       - Inicia el servidor de desarrollo Metro"
	@echo "  make run-android - Compila e instala la app en Android (Emulador/USB)"
	@echo "  make run-ios     - Compila e instala la app en iPhone físico"
	@echo "  make clean       - Elimina cachés y regenera el entorno nativo"

# Configuración inicial del entorno en macOS
env-setup:
	brew install cocoapods
	brew link --overwrite cocoapods
	npm install -g patch-package

# Instalación de librerías del proyecto
init:
	npx expo install expo-dev-client react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
	npm install patch-package --save-dev

# Generación de código nativo
prebuild:
	npx expo prebuild

# Aplicación de parches
patch:
	npx patch-package expo-modules-jsi

# Gestión de Pods para iOS
pods:
	cd ios && pod install --repo-update && cd ..

# Iniciar servidor JavaScript
start:
	npx expo start

# Iniciar servidor JavaScript con cache limpiada
start-c:
	npx expo start -c

# Compilar e instalar en Android
run-android:
	npx expo run:android

# Compilar e instalar en iOS
run-ios:
	npx expo run:ios --device

# Limpieza completa y regeneración
clean:
	rm -rf ios android node_modules/.cache
	npx expo prebuild
	cd ios && pod install && cd ..