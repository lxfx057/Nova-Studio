import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react],
  // Vercel serves this project at the domain root, not /Nova-Studio/.
  base: '/',
})
