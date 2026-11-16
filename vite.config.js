import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Servidor local de desarrollo y vista previa.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 8765,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8765,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
