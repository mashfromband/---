// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { User } from "../entity/user";

export class CommonUserHandler {
    public static async getUserByUserId(manager: EntityManager, userId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(User, "user")
            .where("user.id = :userId and user.isValid = :isValid")
            .setParameters({
                userId: userId,
                isValid: true,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();
    }

    public static async getUserByUserIdWithProfile(manager: EntityManager, userId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.profile", "user_profile")
            .where("user.id = :userId and user.isValid = :isValid")
            .setParameters({
                userId: userId,
                isValid: true,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();

    }

    public static async getUserByMailAddress(manager: EntityManager, mailAddress: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(User, "user")
            .where("user.mailAddress = :mailAddress and user.isValid = :isValid")
            .setParameters({
                mailAddress: mailAddress,
                isValid: true,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();
    }

    public static async getUserByOutgoingId(manager: EntityManager, outgoingId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(User, "user")
            .where("user.outgoingId = :outgoingId and user.isValid = :isValid")
            .setParameters({
                outgoingId: outgoingId,
                isValid: true,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();
    }
}