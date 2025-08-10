import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mlm/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});