import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  plugins: [glsl()],
  build: {
    outDir: path.resolve(__dirname, '../public/portfolio-sketch219'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/portfolio-entry.ts'),
      output: {
        entryFileNames: 'portfolio-sketch219.js',
        assetFileNames: 'portfolio-sketch219.[ext]',
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
});
