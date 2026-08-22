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
            if (id.includes('framer-motion')) {
              return 'animations'
            }
            if (id.includes('date-fns')) {
              return 'dates'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
          }
          
          // Code splitting para páginas e componentes grandes
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('/')[0]
            if (pageName) {
              return `pages/${pageName}`
            }
          }
          
          if (id.includes('/src/components/modals/')) {
            return 'components/modals'
          }
          
          if (id.includes('/src/components/ui/') && !id.includes('/src/components/ui/index.ts')) {
            return 'components/ui'
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@fullcalendar/react'],
  },
})
