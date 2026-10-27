import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/@animate-ui') ||
            id.includes('node_modules/motion') ||
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/radix-ui') ||
            id.includes('node_modules/@radix-ui')
          ) {
            return 'motion-ui';
          }
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
});
