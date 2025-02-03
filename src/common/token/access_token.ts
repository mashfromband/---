import Config from "config";

import moment from "moment";
import {
    JsonWebTokenError,
    JwtPayload,
} from "jsonwebtoken";

import { JSONWebTokenUtils } from "../../utils/jwt";

import { User } from "../../entity/user";
import { UserRoleType } from "../../entity/user_role";

type AccessTokenType = {
    exp: number,
    iat: number,
    aud: string,
    iss: string,
    uid: string,
    role?: string,
    cid?: string,
}

export type CreateAccessTokenOptionType = {
    role?: UserRoleType,
    cid?: string, // CompanyId の略
}

export class AccessToken {
    public static async create(user: User, now: Date, options?: CreateAccessTokenOptionType) {
        const secret = process.env.RL_ACCESS_TOKEN_SECRET as string;
        const expireSec = Config.get<number>("token.access.expireSec");
        const issuer = Config.get<string>("token.access.issuer");
        const audience = Config.get<string>("token.access.audience");
        const expireAt = moment(now).add(expireSec, "second").unix();
        const payload: AccessTokenType = {
            exp: expireAt,
            iat: moment(now).unix(),
            aud: audience,
            iss: issuer,
            uid: user.id,
        };
        if (options) {
            if (options.role) {
                payload.role = options.role;
            }
            if (options.cid) {
                payload.cid = options.cid;
            }
        }
        return {
            token: await JSONWebTokenUtils.signAsync(payload, secret),
            expireAt: expireAt,
        };
    }

    public static async verify(accessToken: string, now: Date) {
        let verifyResult: string | JwtPayload | undefined;
        try {
            verifyResult = await JSONWebTokenUtils.verifyAsync(
                accessToken,
                process.env.RL_ACCESS_TOKEN_SECRET as string,
                {
                    algorithm: Config.get('token.access.algorithm'),
                    audience: Config.get('token.access.audience'),
                    issuer: Config.get('token.access.issuer'),
                },
            );
        }
        catch (err) {
            if (err instanceof JsonWebTokenError) {
                return false;
            }
            else {
                throw(err);
            }
        }

        if (!verifyResult || typeof verifyResult === "string" || !verifyResult.uid) {
            return false;
        }

        return verifyResult;
    }
}
