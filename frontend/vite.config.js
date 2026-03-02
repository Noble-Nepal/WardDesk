import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7001",
        changeOrigin: true,
        secure: false, // accept self-signed cert on backend
      },
    },
  },
});
