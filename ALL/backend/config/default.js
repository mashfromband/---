// -*- coding: utf-8 -*-

const defer = require('config/defer').deferConfig;

const authServerPort = 7000;
const authServerBaseUrl = "http://localhost:" + authServerPort;

const contentsServerPort = 7100;
const contentsServerBaseUrl = "http://localhost:" + contentsServerPort;
const contentsServerOpenBaseUrl = "http://localhost:" + contentsServerPort;

const apiServerPort = 7001;
const apiServerBaseUrl = "http://localhost:" + apiServerPort;

const adminApiServerPort = 7002;
const adminApiServerBaseUrl = "http://localhost:" + adminApiServerPort;

const config = {
    system: {
        doomsday: "9999-12-31",
    },

    authServer: {
        httpd: {
            port: authServerPort,
            baseUrl: authServerBaseUrl,
        },
        cors: {
            config: {
                origin: [
                    "http://localhost:7100",
                    "http://localhost:7200",
                    "http://localhost:3000",
                ],
                methods: [
                    "GET", "HEAD", "POST", "PUT", "DELETE",
                ],
                allowedHeaders: [
                    "origin",
                    "content-type",
                    "authorization",
                ],
                preflightContinue: false,
                maxAge: 60 * 60, // 1hour
            },
        },
        loginSession: {
            name: "rl_auth.sid",
            cookie: {
                httpOnly: true,
                sameSite: true,
                secure: false,
            },
            resave: false,
            saveUninitialized: false,
            redis: {
                prefix: "rl_auth_session:",
            },
        },

        userRegist: {
            url: contentsServerOpenBaseUrl + "/auth/user_regist",
            token: {
                byte: 32,
                expireSec: 60 * 60, // 1hour
            },
            redis: {
                dbName: "systemTemp",
                key: {
                    prefix: "UserRegist:",
                },
            },
            sendMail: false,
            mail: {
                tempRegist: {
                    subject: "『Realize Learning』本登録のお願い",
                    body: "master_data/temp_regist/mail.txt",
                },
            },
        },

        forgetPassword: {
            url: contentsServerOpenBaseUrl + "/auth/reset_password",
            token: {
                byte: 32,
                expireSec: 60 * 60, // 1hour
            },
            redis: {
                dbName: "systemTemp",
                key: {
                    prefix: "ForgetPassword:",
                },
            },
            sendMail: false,
            mail: {
                subject: "『Realize Learning』パスワード再設定",
                fromAddress: "noreply@realizelearning.net",
                templateFile: "templates/mail/forget_password.ejs",
            },
        },

        userWithdrawal: {
            mailAddress: {
                secret: "wMs-2CoFPa5Jp4ofHh_GTtjw_ib7vgpx12LJvnvhZUni6V9_028wcEo4thqYN_Bf",
            },
        },
    },

    apiServer: {
        httpd: {
            port: apiServerPort,
            baseUrl: apiServerBaseUrl,
        },
        cors: {
            config: {
                origin: [
                    "http://localhost:7100",
                    "http://localhost:3000",
                ],
                methods: [
                    "GET", "HEAD", "POST", "PUT", "DELETE",
                ],
                allowedHeaders: [
                    "origin",
                    "content-type",
                    "authorization",
                ],
                preflightContinue: false,
                maxAge: 60 * 60, // 1hour
            },
        },
    },

    adminApiServer: {
        httpd: {
            port: adminApiServerPort,
            baseUrl: adminApiServerBaseUrl,
        },
        cors: {
            config: {
                origin: [
                    "http://localhost:7200",
                    "http://localhost:3000",
                ],
                methods: [
                    "GET", "HEAD", "POST", "PUT", "DELETE",
                ],
                allowedHeaders: [
                    "origin",
                    "content-type",
                    "authorization",
                ],
                preflightContinue: false,
                maxAge: 60 * 60, // 1hour
            },
        },
    },

    redis: {
        useTls: false,
        useAuth: false,
        loginSession: {
            db: 0,
        },
        systemTemp: {
            db: 1,
        },
        questSession: {
            db: 2,
        },
        responseCache: {
            db: 3,
        },
        dataCache: {
            db: 3,
        },
    },

    token: {
        access: {
            expireSec: 60 * 30, // 30min
            audience: "RL-default",
            issuer: "RL-default",
            algorithm: "HS256",
        },
        refresh: {
            expireDay: 1, // 1day
            byte: 32,
        },
    },

    simpleResponseCache: {
        expireSec: 60 * 60, // 1hour
    },

    skill: {
        useFileCache: true,
        filePath: {
            dataFile: "master_data/skill/skill_dat.json5",
            domainTreeFile: "master_data/skill/skill_domain_tree.json5",
        },
    },

    degico: {
        prefixTradeId: "lo",
    },

    epo: {
        userTotalHave: {
            cache: {
                key: {
                    prefix: "UserTotalHaveEpo:",
                },
                expireSec: 60 * 60, // 1hour
            },
        },
    },

    real: {
        rate: {
            cache: {
                key: "RealEfoRate",
                expireSec: 60 * 60 * 24, // 1hour
            },
        },
        userTotalHave: {
            cache: {
                key: {
                    prefix: "UserTotalHaveReal:",
                },
                expireSec: 60 * 60, // 1hour
            },
        },
    },

    contact: {
        sendMail: false,
        toMailAddress: "cs@realizelearning.net",
        fromMailAddress: "noreply@realizelearning.net",
    },

    digico: {
        mode: "simulation",
        api: {
            gift: {
                endPoint: "https://user.digi-co.net/api/test/v1/gift",
            },
            reference: {
                endPoint: "https://user.digi-co.net/api/test/v1/gift/reference",
            },
        },
    },

    typeOrm: {
        enableLogging: true,
    },
};

module.exports = config;
