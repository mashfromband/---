// -*- coding: utf-8 -*-

import { SimpleResponseCache } from "../../common/cache/simple_response_cache"

const cacheKeyList = [
    "Genre",
    "Category",
    "Quest",
]

export const cacheClear = async () => {
    for (const key of cacheKeyList) {
        await SimpleResponseCache.allDelete(key);
    }
}
