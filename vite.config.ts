import react from '@vitejs/plugin-react'
import path from 'node:path'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(projectRoot, 'client')

function collectHtml(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'public' || entry.name === 'node_modules') continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectHtml(fullPath, files)
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath)
  }
  return files
}

const htmlInputs = Object.fromEntries(
  collectHtml(clientRoot).map((file) => [path.relative(clientRoot, file).replace(/\\/g, '/').replace(/\.html$/, '').replace(/\/index$/, '') || 'home', file]),
)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(clientRoot, 'src') },
  },
  root: clientRoot,
  build: {
    outDir: path.resolve(projectRoot, 'dist/public'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: { input: htmlInputs },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    fs: { strict: true, deny: ['**/.*'] },
  },
  preview: { host: true },
})
