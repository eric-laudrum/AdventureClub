import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      '/api':{
        target: 'https://tqzqkd94-8000.use.devtunnels.ms',
        changeOrigin: true,
        secure: false
      }
    }
  }
})