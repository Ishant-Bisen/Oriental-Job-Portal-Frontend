import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    /* Listen on all local interfaces so both localhost and 127.0.0.1 work. */
    host: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            /*
             * Backend CORS allowlist only includes http://localhost:5173.
             * Browsers that open http://127.0.0.1:5173 send Origin: 127.0.0.1
             * and Spring returns 403 "Invalid CORS request". Rewrite Origin
             * so the proxied call is always accepted.
             */
            proxyReq.setHeader('Origin', 'http://localhost:5173')
          })
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app'],
  },
})
