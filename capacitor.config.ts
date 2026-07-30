import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.thruut.auto",
  appName: "thruut Auto",
  webDir: "build",
  plugins: {
    SplashScreen: {},
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
