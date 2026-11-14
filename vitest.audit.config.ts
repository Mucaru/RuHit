import { defineConfig, mergeConfig } from 'vitest/config'
import base from './vite.config'

// Konfigurasi terpisah supaya audit soal tidak ikut ke `pnpm test`.
export default mergeConfig(base, defineConfig({ test: { include: ['src/audit/**/*.audit.ts'], environment: 'node' } }))
