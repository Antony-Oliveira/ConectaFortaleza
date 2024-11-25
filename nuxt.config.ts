// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'
export default defineNuxtConfig({
  app: {
    pageTransition: {name: "page", mode: "out-in"}
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['./global.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@primevue/nuxt-module',
    'nuxt-auth-utils',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})