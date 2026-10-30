import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Ressources FM03 et FM02 partagées, situées hors du dossier frontend.
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../src/ateliers.json', import.meta.url)),
        fileURLToPath(new URL('../src/assets', import.meta.url)),
      ],
    },
  },
})
