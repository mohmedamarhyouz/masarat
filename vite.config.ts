import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['masarat-icon.svg'],
      manifest: {
        name: 'Masarat — مسارات',
        short_name: 'مسارات',
        description: 'حوّل قراراتك إلى مسارات مرئية وخطط قابلة للتنفيذ.',
        theme_color: '#070b14',
        background_color: '#070b14',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          {
            src: '/masarat-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true
  }
})
