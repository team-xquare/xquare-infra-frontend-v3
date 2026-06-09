import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

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
