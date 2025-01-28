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

export type RealType =
    "normal"; // 通常

@Entity()
@Index(["user", "realType", "expireDate"], { unique: true })
export class UserHaveReal extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 0,
    })
    public haveReal: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalAddReal: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalConsumeReal: number = 0;

    @Column({
        type: "enum",
        enum: [
            "normal",
        ],
        default: "normal",
    })
    readonly realType: RealType = "normal";

    @Column({
        type: "varchar",
        length: 32,
        nullable: true,
    })
    public incomingTransactionId?: string | null;

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

    @ManyToOne(() => User, (user) => user.userHaveReals)
    public user?: User;

    constructor(user: User, realType: RealType, expireDate?: Date) {
        super();
        this.user = user;
        this.realType = realType;
        if (expireDate) {
            this.expireDate = expireDate;
        }
        else {
            const doomsday = Config.get("system.doomsday") as string;
            this.expireDate = moment(doomsday).toDate();
        }
    }
}
