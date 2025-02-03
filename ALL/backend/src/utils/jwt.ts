// -*- coding: utf-8 -*-

import jsonwebtoken from "jsonwebtoken";

export class JSONWebTokenUtils {

    public static async signAsync(
        payload: string | object | Buffer,
        secretOrPrivateKey: jsonwebtoken.Secret,
        options: jsonwebtoken.SignOptions = { algorithm: "HS256" },
    ): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(payload, secretOrPrivateKey, options, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            });
        });
    }

    public static async verifyAsync(
        token: string,
        secretOrPrivateKey: jsonwebtoken.Secret,
        options: jsonwebtoken.SignOptions = { algorithm: "HS256" },
    ): Promise<string | jsonwebtoken.JwtPayload | undefined> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, secretOrPrivateKey, options, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }

}
