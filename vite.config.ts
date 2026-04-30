import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Game/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
