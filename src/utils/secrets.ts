// -*- coding: utf-8 -*-

import crypto from "node:crypto";

import base64url from "base64url";

export class Secrets {
    public static async getSecureRandomBytes(size: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(size, (err, buf) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(buf);
                }
            });
        });
    }

    public static async getTokenHex(size: number) {
        try {
            const randoms: Buffer = await this.getSecureRandomBytes(size);
            return randoms.toString("hex");
        }
        catch (err) {
            throw (err);
        }
    }

    public static async getTokenUrlBase64(size: number) {
        try {
            const randoms: Buffer = await this.getSecureRandomBytes(size);
            return base64url.encode(randoms);
        }
        catch (err) {
            throw (err);
        }
    }
}
