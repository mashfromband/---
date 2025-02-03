// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import { nanoid } from "nanoid";
import { Tag } from "../../entity/tag";

export const upsertTag = async (manager: EntityManager, tagList: string[]) => {
    const promiseList = [];

    for (const tag of tagList) {
        if (tag === "") {
            continue;
        }
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Tag)
            .values({
                name: tag,
                outgoingId: nanoid(),
                deletedAt: null,
            })
            .orUpdate(
                ["name", "deletedAt"],
                ["name"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

export const getAllTag = async (manager: EntityManager) => {
    const query = manager
        .createQueryBuilder(Tag, "tag")
        .orderBy("id", "ASC");
    const tags = await query.getMany();
    const tagDict: {[name: string]: Tag} = {};
    for (const tag of tags) {
        tagDict[tag.name] = tag;
    }
    return tagDict;
}
