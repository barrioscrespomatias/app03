  /// <reference types="@capacitor/splash-screen" />

  import { CapacitorConfig } from '@capacitor/cli';

  const config: CapacitorConfig = {
    appId: 'com.example.app3',
    appName: 'app03',
    webDir: 'www',
    server: {
      androidScheme: 'https'
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 3300,
        // launchAutoHide: true,
        launchFadeOutDuration: 3300,
        backgroundColor: "#ffffffff",
        // androidSplashResourceName: "splash",
        // androidScaleType: "CENTER_CROP",
        showSpinner: false,
        androidSpinnerStyle: "small",
        iosSpinnerStyle: "small",
        spinnerColor: "#999999",
        splashFullScreen: true,
        splashImmersive: true,
        // layoutName: "launch_screen",
        // useDialog: true,
      },
    }
  };
  
  export default config;