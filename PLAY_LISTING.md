# Yūgen — Ficha Play Store y checklist de lanzamiento

## Data safety (formulario de Play Console)
- **Recogida de datos:** Ninguna. Todo (favoritos, descargas, prefs, PIN) vive en el dispositivo.
- **Identificadores de publicidad:** No se recogen (AdMob en modo prueba, sin SDK real integrado).
- **Ubicación / contactos / cámara:** No se usan ni se piden.
- **Permisos declarados y por qué:**
  - `INTERNET` → cargar catálogo e imágenes.
  - `SET_WALLPAPER` → fijar fondo desde la app nativa.
  - `READ/WRITE_EXTERNAL_STORAGE (maxSdk 28)` → guardar fondos en dispositivos antiguos.
- **Borrado:** desinstalar o Perfil → Limpiar caché. Contacto: contact@yugen-walls.art

## Texto de ficha (ES)
**Título:** Yūgen — Fondos Anime 4K AMOLED
**Corta:** Fondos anime 4K y AMOLED con vista cinematográfica y modo offline.
**Larga:** [borrador] Yūgen es un estudio de fondos anime en 4K y negros puros AMOLED...

## Gráficos pendientes (los debe aportar diseño)
- Icono adaptativo `432x432` (ya existe `icon.svg`, generar foreground/background)
- Feature graphic `1024x500`
- 2–8 screenshots de teléfono (mínimo 2)
- URL de política de privacidad (publicar `LegalModals` en web o GitHub Pages)
  → Ya incluida como página estática: `public/privacy.html` (se publica como
  `https://TU-DOMINIO/privacy.html`; actualiza esta URL en Play Console).

## Pre-lanzamiento
- [x] Copia de seguridad exportable (Perfil → Exportar/Importar, `backupService.ts`)
- [x] Firma release preparada (`android/keystore.properties.example` + `signingConfigs` en `build.gradle`;
      genera el keystore con el comando del archivo example y compila el AAB)
- [ ] Cambiar PIN admin por defecto (`adminAuthService.ts`) y no publicarlo
- [ ] `versionCode`/`versionName` subidos por release
- [ ] Probar en Android 10, 13 y 15 + gama baja (2GB RAM)
- [ ] Quitar IDs de prueba AdMob o integrar AdMob real + UMP antes de monetizar
- [ ] Integrar Play Billing real o retirar el "Premium" de la ficha
- [ ] In-App Review + In-App Update (pendiente, ver `capacitor.config.ts`)
- [ ] Crashlytics/Sentry con DSN propio
