import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/Final-Rute-Ganteng/',

  optimizeDeps: {
    exclude: ['maplibre-gl']
  },

  build: {
    chunkSizeWarningLimit: 7000,
    rollupOptions: {
      input: {
        main: resolve(currentDirectory, 'index.html'),
        map: resolve(currentDirectory, 'map/index.html')
      }
    }
  }
});