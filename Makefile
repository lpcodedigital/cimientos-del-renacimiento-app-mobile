# ==============================================================================
# MAKEFILE - EXPO SDK 57 DEVELOPMENT WORKFLOW
# ==============================================================================

.PHONY: help env-setup init prebuild patch pods run-android run-ios clean start deep-clean

help:
	@echo "Comandos disponibles:"
	@echo "  make env-setup   - Configura dependencias del sistema (CocoaPods/Homebrew)"
	@echo "  make init        - Inicializa las dependencias clave de Expo y Dev Client"
	@echo "  make prebuild    - Genera las carpetas nativas /android e /ios limpias"
	@echo "  make patch       - Genera/aplica los parches con patch-package"
	@echo "  make pods        - Instala y actualiza las dependencias Pods de iOS"
	@echo "  make start       - Inicia el servidor de desarrollo Metro"
	@echo "  make start-c     - Inicia el servidor Metro limpiando la caché"
	@echo "  make run-android - Compila e instala la app en Android (Emulador/USB)"
	@echo "  make run-ios     - Compila e instala la app en iPhone físico"
	@echo "  make clean       - Elimina carpetas nativas y regenera"
	@echo "  make deep-clean  - Limpieza total (Xcode, Watchman, Node Modules, Metro)"

env-setup:
	brew install cocoapods
	brew link --overwrite cocoapods
	npm install -g patch-package

init:
	npx expo install expo-dev-client react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
	npm install patch-package --save-dev

prebuild:
	npx expo prebuild --clean

patch:
	npx patch-package

pods:
	cd ios && pod install --repo-update && cd ..

start:
	npx expo start

start-c:
	npx expo start -c

run-android:
	npx expo run:android

run-ios:
	npx expo run:ios --device

clean:
	rm -rf ios android node_modules/.cache
	npx expo prebuild --clean
	cd ios && pod install && cd ..

deep-clean:
	@echo "Iniciando limpieza nuclear..."
	watchman watch-del-all
	rm -rf node_modules package-lock.json
	rm -rf ios android
	rm -rf ~/Library/Developer/Xcode/DerivedData/
	rm -rf $$TMPDIR/metro-*
	rm -rf $$TMPDIR/haste-map-*
	npm install
	npx expo prebuild --clean
	cd ios && pod install && cd ..
	@echo "Limpieza completada. Listo para compilar."