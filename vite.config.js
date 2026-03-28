import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This root Vite config exists only for legacy usage.
  // The correct dev server for the app is the one inside `./frontend`.
  server: {
    port: 5173,
    open: true,
  },
})
