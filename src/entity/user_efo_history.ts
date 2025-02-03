// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { nanoid } from "nanoid";

import { User } from "./user";

export type ReasonType =
    "questClear" | // クエストクリア
    "exchangeReal"; // リアルに両替した

@Entity()
export class UserEfoHistory extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
    })
    public modifyEfo: number = 0;

    @Column({
        type: "enum",
        enum: [
            "questClear",
            "exchangeReal",
        ],
    })
    readonly reason: ReasonType;

    @Column({
        type: "varchar",
        length: 32,
        unique: true,
    })
    readonly transactionId: string;

    @Column({
        type: "datetime",
        nullable: true,
    })
    public expireDate: Date | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userEfoHistorys)
    public user?: User;

    constructor(user: User, reason: ReasonType, transactionId?: string) {
        super();
        this.user = user;
        this.reason = reason;
        if (!transactionId) {
            this.transactionId = UserEfoHistory.generateTransactionId();
        }
        else {
            this.transactionId = transactionId;
        }
    }

    public static generateTransactionId() {
        return "EFO" + nanoid();
    }
}
