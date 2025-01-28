// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    port: 7100,
  },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "nuxt-security"
  ],
  experimental: {
    asyncContext: true,
  },

  vite: {
    optimizeDeps: {
      include:[
        "@vueuse/core",
        "aos",
        "canvas-confetti",
        "date-fns",
        "v-calendar",
        "vue-ellipse-progress",
        "yup",
      ],
    },
  },

  content: {
    // ... options
  },

  runtimeConfig: {
    public: {
      authApiEndpoint: process.env.NUXT_PUBLIC_AUTH_API_ENDPOINT || "http://localhost:7000",
      apiEndpoint: process.env.NUXT_PUBLIC_API_ENDPOINT || "http://localhost:7001",
      staticCdnBaseUrl: process.env.NUXT_PUBLIC_STATIC_CDN_BASE_URL || "",
      managementToolsUrl: process.env.NUXT_PUBLIC_MANAGEMENT_URL || "http://localhost:7200",
      questMissionCdnBaseUrl: process.env.NUXT_PUBLIC_QUEST_MISSION_CDN_BASE_URL || "http://localhost:7001/local_s3",
    },
  },

  app: {
    head: {
      script: [
        {
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6778564467483361",
          async: true,
          crossorigin: "anonymous",
        },
      ]
    },
  },

  css: [
    'aos/dist/aos.css', // AOSのCSSをインポート
    '~/assets/css/main.css',  //  カスタムcssをインポート
  ],
  plugins: [
    { src: '~/plugins/aos.ts', mode: 'client' }, // AOSをプラグインとして読み込み
  ],

  nitro: {
    compressPublicAssets: true,
  },

  security: {
    headers: {
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginEmbedderPolicy: false,
    },
  },
})
