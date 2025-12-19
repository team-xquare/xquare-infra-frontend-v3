import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@xquare/user-interfaces": path.resolve(
        __dirname,
        "../../modules/xquare-user-interfaces/index.ts"
      ),
      "@xquare/user-interfaces/": path.resolve(
        __dirname,
        "../../modules/xquare-user-interfaces/"
      ),
      "@xquare/utils": path.resolve(
        __dirname,
        "../../modules/xquare-utils/index.ts"
      ),
      "@xquare/utils/": path.resolve(__dirname, "../../modules/xquare-utils/"),
    },
  },
});
