import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'my-trackr',
        short_name: 'my-trackr',
        description: 'A minimal daily habit tracker',
        start_url: '/',
        display: 'standalone',
        background_color: '#eef0e6',
        theme_color: '#eef0e6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell + fonts so it fully works offline.
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg}'],
      },
      devOptions: {
        // Lets us test install/offline behavior with `npm run dev` too.
        enabled: true,
      },
    }),
  ],
})
