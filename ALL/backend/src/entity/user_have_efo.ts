// -*- coding: utf-8 -*-

import moment from "moment";
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
} from "typeorm";

import Config from "config";

import { User } from "./user";

export type EfoType = 
    "questClear" | // クエストクリア
    "free"; // 無料

@Entity()
@Index(["user", "efoType", "expireDate"], { unique: true })
export class UserHaveEfo extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 0,
    })
    public haveEfo: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalAddEfo: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalConsumeEfo: number = 0;

    @Column({
        type: "enum",
        enum: [
            "questClear",
            "free",
        ]
    })
    readonly efoType: EfoType;

    @Column({
        type: "datetime",
    })
    readonly expireDate: Date;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userHaveEfos)
    public user?: User;

    constructor(user: User, efoType: EfoType, expireDate?: Date) {
        super();
        this.user = user;
        this.efoType = efoType;
        if (expireDate) {
            this.expireDate = expireDate;
        }
        else {
            const doomsday = Config.get("system.doomsday") as string;
            this.expireDate = moment(doomsday).toDate();
        }
    }
}
