import Config from "config";
import moment from "moment";
import { EntityManager, QueryRunner } from "typeorm";

import { Secrets } from "../../utils/secrets";
import { UserRefreshToken } from "../../entity/user_refresh_token";

import { User } from "../../entity/user";
import { UserRoleType } from "../../entity/user_role";

export type RefreshTokenSaveOptions = {
    isManagementToken?: boolean,
    role?: UserRoleType,
    recruitCompanyId?: string,
}

export class RefreshToken {

    readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    public async save(manager: EntityManager, user: User, now: Date, options?: RefreshTokenSaveOptions) {
        const expireAt = this.getExpireAt(now);
        const newRow = new UserRefreshToken(this.token, expireAt);
        newRow.user = user;
        newRow.isManagementToken = false;
        if (options) {
            if (options.isManagementToken) {
                newRow.isManagementToken = options.isManagementToken;
            }
            if (options.role) {
                newRow.role = options.role;
            }
            if (options.recruitCompanyId) {
                newRow.recruitCompanyId = options.recruitCompanyId;
            }
        }
        return await manager.save(newRow);
    }

    public getExpireAt(now: Date) {
        const expireDay = Config.get<number>("token.refresh.expireDay");
        const expireAt = moment(now).add(expireDay, "day").toDate();
        return expireAt;
    }

    // MEMO: 必ずトランザクション内で呼ぶこと
    public async load(manager: EntityManager, now: Date, forUpdate?: boolean) {
        const query = manager
            .createQueryBuilder(UserRefreshToken, "urf")
            .leftJoinAndSelect("urf.user", "user")
            .where("urf.token = :refreshToken and urf.expireAt > :now")
            .setParameters({
                refreshToken: this.token,
                now: now,
            });
            if (forUpdate) {
                query.setLock("pessimistic_write");
            }
        return query.getOne();
    }

    public static async create() {
        const token = await this.createTokenOnly();
        return new RefreshToken(token);
    }

    public static async createTokenOnly() {
        const size = Config.get<number>("token.refresh.byte");
        return Secrets.getTokenUrlBase64(size);
    }

}