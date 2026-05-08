/// <reference types="vite/client" />

declare module 'piper-tts-web'

interface Window {
  webkitAudioContext: typeof AudioContext
}
