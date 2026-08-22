import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    // Bundle visualizer para análise de performance (rodar com ANALYZE=true npm run build)
    // process.env.ANALYZE && (await import('vite-bundle-visualizer/plugin')).default(),
    // PWA para cache offline e melhor performance
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Olympus Template',
        short_name: 'Olympus',
        description: 'Template Olympus - Sistema de Gestão Completo',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 dia
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@fullcalendar/react'],
  },
})
