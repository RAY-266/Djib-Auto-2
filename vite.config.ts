import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],
    base: "/",
    server: {
      port: 3000,
      host: true
    },
    define: {
      "process.env.API_KEY": JSON.stringify(env.API_KEY)
    }
  };
});
