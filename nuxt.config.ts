// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-echarts",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
  ],
  pwa: {
    manifest: {
      name: "clean10th",
      short_name: "clean10th",
      description: "dashboard for clean10th",
      start_url: "./",
      display: "standalone",
      lang: "en",
      icons: [
        {
          src: "clean10th.png",
          sizes: "500x500",
          type: "image/png",
        },
      ],
    },
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
    },
  },
});
