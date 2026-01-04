import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // This allows the Netlify preview server to "see" the port
    port: 5173,
    strictPort: true,
  }
})
