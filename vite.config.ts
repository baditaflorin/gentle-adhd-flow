import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.PAGES_BASE ?? '/gentle-adhd-flow/',
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    modulePreload: false,
    sourcemap: false,
  },
  plugins: [react(), tailwindcss()],
})
