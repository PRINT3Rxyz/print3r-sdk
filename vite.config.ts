import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "ReactTradeSDK",
      fileName: (format) => `react-trade-sdk.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      // @ts-ignore
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          if (
            assetInfo &&
            assetInfo.name &&
            assetInfo.name.includes("style.css")
          ) {
            return "react-trade-sdk.css";
          }
          return assetInfo.name;
        },
      },
    },
    cssCodeSplit: false,
    // Ensure CSS is generated
    assetsDir: "assets",
  },
});
