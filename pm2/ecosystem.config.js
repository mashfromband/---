module.exports = {
    apps : [
        {
            name: "auth_server",
            script: "dst/auth_server/index.js",
            mode: "fork",
            env_production: {
                NODE_ENV: "production",
            },
            env_develop: {
                NODE_ENV: "develop",
            },
        },
        {
            name: "api_server",
            script: "dst/api_server/index.js",
            mode: "fork",
            env_production: {
                NODE_ENV: "production",
            },
            env_develop: {
                NODE_ENV: "develop",
            },
        },
        {
            name: "admin_api_server",
            script: "dst/admin_api_server/index.js",
            mode: "fork",
            env_production: {
                NODE_ENV: "production",
            },
            env_develop: {
                NODE_ENV: "develop",
            },
        },
    ],
}
