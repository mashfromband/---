// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    port: 7200,
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
        "date-fns",
        "v-calendar",
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
      adminAuthApiEndpoint: process.env.NUXT_PUBLIC_ADMIN_API_ENDPOINT || "http://localhost:7002",
    },
  },

  ssr: false,

  security: {
    headers: {
      contentSecurityPolicy: false,
    },
  },
})
