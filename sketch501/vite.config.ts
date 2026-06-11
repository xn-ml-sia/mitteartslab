import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, '../public/portfolio-sketch501'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/portfolio-entry.ts'),
      output: {
        entryFileNames: 'portfolio-sketch501.js',
        assetFileNames: 'portfolio-sketch501.[ext]',
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
});
