// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import moment from "moment";

import { appDataSource } from "../../data-source";

import { OfficialNews } from "../../entity/official_new";

const insertNewsList = [
    {
        title: "おしらせ001",
        detail: "おしらせです\nおしらせです\nおしらせです",
        beginPeriodAt: "2024-09-18",
        endPeriodAt: undefined,
    },
    {
        title: "おしらせ002",
        detail: "お知らせです\nお知らせです\nお知らせです",
        beginPeriodAt: "2024-09-18",
        endPeriodAt: "2024-10-01",
    },
    {
        title: "重大なるおしらせ001",
        detail: "大事なおしらせです\n大事なおしらせです\n大事なおしらせです",
        beginPeriodAt: "2024-09-18",
        priority: 100,
        endPeriodAt: undefined,
    },
];

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const newsList: OfficialNews[] = [];
            for (const news of insertNewsList) {
                const newNews = new OfficialNews(
                    news.title,
                    news.detail,
                    moment(news.beginPeriodAt, "YYYY-MM-DD").toDate(),
                );
                if (news.endPeriodAt) {
                    newNews.endPeriodAt = moment(news.endPeriodAt, "YYYY-MM-DD").toDate();
                }
                if (news.priority) {
                    newNews.priority = news.priority;
                }
                newsList.push(newNews);
            }
            await manager.save(newsList);
        });

        resolve(true);
    });
}

main().then((result) => {
    console.log("DONE.");
    appDataSource.destroy();
}).catch((err) => {
    console.error(err);
    appDataSource.destroy();
});
