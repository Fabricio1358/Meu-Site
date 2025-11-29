import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // O "@" aponta para a pasta "src" dentro do diretório atual (__dirname)
      "@": path.resolve(__dirname, "./src"),
    },
  },
})