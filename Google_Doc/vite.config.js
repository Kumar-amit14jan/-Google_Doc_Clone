import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cuddly-waddle-4w4v75xgg7x2j564-9000.app.github.dev/', // Your backend URL
        changeOrigin: true, // This ensures the correct origin is set in the request
        secure: true, // Set this to true if your backend uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Adjust path if needed
      },
    },
  },
})
