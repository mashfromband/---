require("dotenv").config();

module.exports = {
    apps : [
        {
            name: "management_server",
            script: ".output/server/index.mjs",
            mode: "fork",
            port: 4000,
            env_production: {
                NODE_ENV: "production",
                NUXT_PUBLIC_AUTH_API_ENDPOINT: process.env.NUXT_PUBLIC_AUTH_API_ENDPOINT,
                NUXT_PUBLIC_API_ENDPOINT: process.env.NUXT_PUBLIC_API_ENDPOINT,
                NUXT_PUBLIC_ADMIN_API_ENDPOINT: process.env.NUXT_PUBLIC_ADMIN_API_ENDPOINT,
                NUXT_PUBLIC_STATIC_CDN_BASE_URL: process.env.NUXT_PUBLIC_STATIC_CDN_BASE_URL,
            },
            env_develop: {
                NODE_ENV: "develop",
                NUXT_PUBLIC_AUTH_API_ENDPOINT: process.env.NUXT_PUBLIC_AUTH_API_ENDPOINT,
                NUXT_PUBLIC_API_ENDPOINT: process.env.NUXT_PUBLIC_API_ENDPOINT,
                NUXT_PUBLIC_ADMIN_API_ENDPOINT: process.env.NUXT_PUBLIC_ADMIN_API_ENDPOINT,
                NUXT_PUBLIC_STATIC_CDN_BASE_URL: process.env.NUXT_PUBLIC_STATIC_CDN_BASE_URL,
            },
        },
    ],
}
