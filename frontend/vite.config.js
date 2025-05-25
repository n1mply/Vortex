import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, 
    proxy: {
      '/api': {
        target: 'http://192.168.1.10:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        ws: true,
      },
    },
  },
  
})