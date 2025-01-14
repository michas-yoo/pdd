// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-swiper'],
  css: ['~/assets/css/style.css'],
  app: {
    head: {
      title: 'Тренажер знаков и разметки',
    },
  },
});
