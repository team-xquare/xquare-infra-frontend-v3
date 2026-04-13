import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Xquare Infra User",
        short_name: "Xquare Infra",
        description: "Xquare Infra V3 PWA Application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "minimal-ui",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@xquare/hooks": path.resolve(
        __dirname,
        "../../modules/xquare-hooks/index.ts",
      ),
      "@xquare/hooks/": path.resolve(__dirname, "../../modules/xquare-hooks/"),
      "@xquare/user-interfaces": path.resolve(
        __dirname,
        "../../modules/xquare-user-interfaces/index.ts",
      ),
      "@xquare/user-interfaces/": path.resolve(
        __dirname,
        "../../modules/xquare-user-interfaces/",
      ),
      "@xquare/utils": path.resolve(
        __dirname,
        "../../modules/xquare-utils/index.ts",
      ),
      "@xquare/utils/": path.resolve(__dirname, "../../modules/xquare-utils/"),
    },
  },
});
