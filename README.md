# Kampania – APK

## Wariant A: bez instalowania czegokolwiek (GitHub)
1. Utwórz puste repozytorium na github.com i wgraj do niego zawartość tego folderu.
2. Zakładka **Actions → Build APK → Run workflow**.
3. Po ok. 5 min pobierz `kampania-apk` (app-debug.apk) z artefaktów i zainstaluj na telefonie
   (zezwól na instalację z nieznanych źródeł).

## Wariant B: lokalnie (Node 22, JDK 21, Android SDK)
    npm install
    npx cap add android
    npm run apk
APK: android/app/build/outputs/apk/debug/app-debug.apk

Aplikacja działa offline; postęp zapisuje się w pamięci aplikacji.
