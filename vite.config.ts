import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/surepass': {
        target: 'https://kyc-api.surepass.app',
        changeOrigin: true,
        rewrite: (path) => {
          const endpoint = path.replace('/api/surepass-', '');
          const routes: Record<string, string> = {
            pan: '/api/v1/pan/pan-comprehensive',
            gst: '/api/v1/corporate/gstin',
            bank: '/api/v1/bank-verification/',
            msme: '/api/v1/corporate/udyog-aadhaar',
          };
          return routes[endpoint] || path;
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const token = process.env.VITE_SUREPASS_AUTH_TOKEN || '';
            proxyReq.setHeader('Authorization', `Bearer ${token}`);
          });
        },
      },
    },
  },
})
