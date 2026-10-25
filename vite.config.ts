import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router", "react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux", "redux-persist"],
          "ui-vendor": ["react-bootstrap", "bootstrap", "react-slick", "slick-carousel"],
          leaflet: ["leaflet"],
          i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
})
