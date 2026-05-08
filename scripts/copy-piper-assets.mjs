import { cpSync, mkdirSync } from 'node:fs'

mkdirSync('docs/onnx', { recursive: true })
mkdirSync('docs/piper', { recursive: true })
cpSync('node_modules/piper-tts-web/dist/onnx', 'docs/onnx', { recursive: true })
cpSync('node_modules/piper-tts-web/dist/piper', 'docs/piper', { recursive: true })
