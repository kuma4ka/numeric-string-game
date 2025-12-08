import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/numeric-string-game/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/numeric-string-game/',
      start_url: '/numeric-string-game/',

      manifest: {
        name: 'Numeric String Game',
        short_name: 'NumGame',
        description: 'A simple numeric memory game',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
