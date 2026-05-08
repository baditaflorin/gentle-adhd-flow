import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.PAGES_BASE ?? '/gentle-adhd-flow/',
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@huggingface/transformers')) return 'ai-transformers'
          if (id.includes('@duckdb/duckdb-wasm')) return 'duckdb-wasm'
          if (id.includes('piper-tts-web')) return 'piper-tts'
          if (id.includes('tone')) return 'tone-focus'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'node_modules/piper-tts-web/dist/onnx', dest: '.' },
        { src: 'node_modules/piper-tts-web/dist/piper', dest: '.' },
        { src: 'node_modules/piper-tts-web/dist/worker', dest: '.' },
      ],
      silent: true,
    }),
  ],
})
