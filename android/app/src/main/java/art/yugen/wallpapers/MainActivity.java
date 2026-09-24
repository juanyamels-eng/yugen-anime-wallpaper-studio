package art.yugen.wallpapers;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(YugenWallpaperPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
