require("dotenv").config();

module.exports = {
    apps : [
        {
            name: "content_server",
            script: ".output/server/index.mjs",
            mode: "fork",
            env_production: {
                NODE_ENV: "production",
                NUXT_PUBLIC_AUTH_API_ENDPOINT: process.env.NUXT_PUBLIC_AUTH_API_ENDPOINT,
                NUXT_PUBLIC_API_ENDPOINT: process.env.NUXT_PUBLIC_API_ENDPOINT,
                NUXT_PUBLIC_STATIC_CDN_BASE_URL: process.env.NUXT_PUBLIC_STATIC_CDN_BASE_URL,
                NUXT_PUBLIC_MANAGEMENT_URL: process.env.NUXT_PUBLIC_MANAGEMENT_URL,
                NUXT_PUBLIC_QUEST_MISSION_CDN_BASE_URL: process.env.NUXT_PUBLIC_QUEST_MISSION_CDN_BASE_URL,
            },
            env_develop: {
                NODE_ENV: "develop",
                NUXT_PUBLIC_AUTH_API_ENDPOINT: process.env.NUXT_PUBLIC_AUTH_API_ENDPOINT,
                NUXT_PUBLIC_API_ENDPOINT: process.env.NUXT_PUBLIC_API_ENDPOINT,
                NUXT_PUBLIC_STATIC_CDN_BASE_URL: process.env.NUXT_PUBLIC_STATIC_CDN_BASE_URL,
                NUXT_PUBLIC_MANAGEMENT_URL: process.env.NUXT_PUBLIC_MANAGEMENT_URL,
                NUXT_PUBLIC_QUEST_MISSION_CDN_BASE_URL: process.env.NUXT_PUBLIC_QUEST_MISSION_CDN_BASE_URL,
            },
        },
    ],
}
