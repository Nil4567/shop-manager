import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  define: {
    // This correctly maps the API_KEY from the system to the browser code
    'process.env': {
      API_KEY: process.env.API_KEY
    },
    // Polyfill global for compatibility
    'global': 'window',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
