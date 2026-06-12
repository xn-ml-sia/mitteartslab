import glsl from 'vite-plugin-glsl';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  build: {
    outDir: path.resolve(__dirname, '../public/about-sketch393'),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/about-entry.ts'),
      formats: ['es'],
      fileName: 'about-sketch393',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'about-sketch393.js',
      },
    },
  },
});
