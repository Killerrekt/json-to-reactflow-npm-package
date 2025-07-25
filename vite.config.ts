import path from "path"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { readFileSync } from 'fs';

// Read package.json to get peer dependencies
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const peerDeps = Object.keys(packageJson.peerDependencies || {});

export default defineConfig({
  build: {
    // Specifies that the output of the build will be a library.
    lib: {
      // Defines the entry point for the library build.
      // It resolves to src/index.ts, indicating that the library starts from this file.
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "json-to-reactflow",
      // A function that generates the output file
      // name for different formats during the build
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: peerDeps,
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@xyflow/react": "ReactFlow",
          "lucide-react": "LucideReact",
        },
      },
    },
    // Generates sourcemaps for the built files, aiding in debugging.
    sourcemap: true,
    // Clears the output directory before building.
    emptyOutDir: true,
  },
  // react() enables React support.
  // dts() generates TypeScript declaration files (*.d.ts) during the build.
  // cssInjectedByJsPlugin() injects CSS dynamically into the JS bundle.
  // viteStaticCopy() copies static assets to the dist folder.
  plugins: [
    react(),
    dts(),
    cssInjectedByJsPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets",
          dest: ".",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
