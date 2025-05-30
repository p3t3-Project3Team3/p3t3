import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: process.env.VITE_SERVER_URL ||'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
   build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          apollo: ['@apollo/client'],
          ui: ['semantic-ui-react', 'semantic-ui-css']
        }
      }
    }
  }
});