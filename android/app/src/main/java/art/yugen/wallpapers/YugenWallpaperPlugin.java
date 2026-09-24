package art.yugen.wallpapers;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Plugin nativo Yūgen: fija el fondo vía WallpaperManager.
 * Método JS: YugenWallpaper.setWallpaper({ url, target: 'home' | 'lock' | 'both' })
 */
@CapacitorPlugin(name = "YugenWallpaper")
public class YugenWallpaperPlugin extends Plugin {

    @PluginMethod
    public void setWallpaper(PluginCall call) {
        String url = call.getString("url");
        String target = call.getString("target", "both");
        if (url == null || url.isEmpty()) {
            call.reject("URL vacía");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                Bitmap bitmap = downloadBitmap(url);
                if (bitmap == null) {
                    call.reject("No se pudo descargar la imagen");
                    return;
                }
                WallpaperManager wm = WallpaperManager.getInstance(getContext());
                int which = WallpaperManager.FLAG_SYSTEM;
                boolean lockSupported = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N;

                if ("lock".equals(target) && lockSupported) {
                    wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);
                } else if ("both".equals(target) && lockSupported) {
                    wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM);
                    try {
                        wm.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);
                    } catch (IOException ignored) {
                        // Algunos launchers no permiten lock; home ya quedó aplicado
                    }
                } else {
                    wm.setBitmap(bitmap);
                }

                JSObject ret = new JSObject();
                ret.put("applied", true);
                ret.put("target", target);
                call.resolve(ret);
            } catch (IOException e) {
                call.reject("Error aplicando fondo: " + e.getMessage());
            }
        });
    }

    private Bitmap downloadBitmap(String urlStr) throws IOException {
        HttpURLConnection conn = null;
        InputStream in = null;
        try {
            URL url = new URL(urlStr);
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(30000);
            conn.setDoInput(true);
            conn.connect();
            in = conn.getInputStream();
            return BitmapFactory.decodeStream(in);
        } finally {
            if (in != null) {
                try { in.close(); } catch (IOException ignored) {}
            }
            if (conn != null) conn.disconnect();
        }
    }
}
