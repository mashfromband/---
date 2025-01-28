// -*- coding: utf-8 -*-

import { createHash } from "node:crypto";

export const getHash = (path: string) => {
    const hash = createHash("sha224");
    hash.update(path);
    return hash.digest("base64url");
}

