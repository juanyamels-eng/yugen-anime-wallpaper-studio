# Yūgen — Compilar la app Android (APK / AAB)

Ya tienes la plataforma nativa en `android/` + plugin `YugenWallpaper` (WallpaperManager).

## Requisitos (en tu PC)
1. **Android Studio** (Ladybug o superior) + **JDK 17**.
2. Abrir la carpeta `android/` de este proyecto en Android Studio y dejar que sincronice Gradle.

## Generar APK de prueba
```bash
npm run build:android
npx cap open android
```
En Android Studio: `Build > Build App Bundle(s) / APK(s) > Build APK(s)`.
El APK sale en `android/app/build/outputs/apk/debug/app-debug.apk`. Instálalo en tu celular.

## Generar AAB para Play Store
En Android Studio: `Build > Generate Signed Bundle / APK > Android App Bundle`.
Necesitas tu keystore de firma. El `applicationId` es `art.yugen.wallpapers` (`capacitor.config.ts`).

## Qué hace cada parte nativa
| Parte | Archivo | Función |
|---|---|---|
| Fijar fondo directo | `android/.../YugenWallpaperPlugin.java` | `WallpaperManager.setBitmap` home/lock/both |
| Registro plugin | `.../MainActivity.java` | `registerPlugin(YugenWallpaperPlugin.class)` |
| Permisos | `android/.../AndroidManifest.xml` | `SET_WALLPAPER`, storage legacy maxSdk 28, INTERNET |
| Guardar en Galería | `src/services/wallpaperNative.ts` | `Filesystem.writeFile` → `Documents/Yugen/` |
| Compartir | `src/services/wallpaperNative.ts` | `Share.share` con Intent Android |
| Status/splash | `src/main.tsx` + `capacitor.config.ts` | Barra `#090B10`, splash 1200ms |

## Flujo en la app
- **Con plugin** (APK): `Aplicar fondo` → `YugenWallpaper.setWallpaper` → fondo directo del sistema.
- **Sin plugin / PWA web**: descarga a `Documents/Yugen` o blob + guía `Galería > Establecer como fondo`.
- **Compartir nativo**: guarda y abre el sheet de Android con el archivo real.

## Comandos útiles
```bash
npm run build:android   # build web + sync a android/
npm run cap:sync        # solo sincronizar
npm run android:open    # abrir en Android Studio
```

> Nota: este PC no tiene JDK/SDK, por eso el APK no se compiló aquí.
> El `tsc` + `vite build` + `cap sync` están verificados y pasan.
