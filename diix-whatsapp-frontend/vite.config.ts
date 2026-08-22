import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') && !id.includes('react-hook-form')) {
              return 'vendor'
            }
            if (id.includes('recharts')) {
              return 'charts'
            }
            if (id.includes('@radix-ui')) {
              return 'ui'
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms'
            }
            if (id.includes('@fullcalendar')) {
              return 'calendar'
            }
            if (id.includes('jspdf')) {
              return 'pdf'
            }
            if (id.includes('html2canvas')) {
              return 'canvas'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
