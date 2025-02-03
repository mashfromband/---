// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { SimpleResponseCache } from "../../common/cache/simple_response_cache";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { UserIcon } from "../../entity/user_icon";

type ResponseType =
    paths["/user-icon"]["get"]["responses"][200]["content"]["application/json"];
type OneUserIcon =
    components["schemas"]["oneUserIcon"];

export class UserIconAPIController extends BaseAPIController {
    public async getList() {
        const cacheResponseIns = new SimpleResponseCache("UserIcon", "List");
        const cachedResponse = await cacheResponseIns.load() as ResponseType | null;
        if (cachedResponse) {
            this.responseJSON(cachedResponse);
            return;
        }

        const userIconList = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserIcon, "ui")
                .orderBy("ui.id", "ASC");
            return query.getMany();
        });

        const responseUserIconList: OneUserIcon[] = [];
        for (const userIcon of userIconList as UserIcon[]) {
            responseUserIconList.push({
                id: userIcon.id.toString(),
                iconPath: userIcon.iconPath,
            });
        }

        const response: ResponseType = {
            userIcons: responseUserIconList,
        };
        this.responseJSON(response);

        await cacheResponseIns.save(response);
    }
}
