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
import { RealEfoRate } from "./real_efo_rate";

export type RealReasonType =
    "exchangeFromEfo" | // EFO から変換された
    "exchangeToDigico"; // デジコに変換した

@Entity()
export class UserRealHistory extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 32,
        unique: true,
    })
    readonly outgoingId: string;

    @Column({
        type: "enum",
        enum: [
            "exchangeFromEfo",
            "exchangeToDigico",
        ],
    })
    readonly reason: RealReasonType;

    @Column({
        type: "int",
        default: 0,
    })
    public modifyReal: number = 0;

    @Column({
        type: "varchar",
        length: 32,
        nullable: true,
    })
    public incomingTransactionId?: string | null;

    @Column({
        type: "datetime",
        nullable: true,
    })
    public expireDate: Date | null = null;

    @Column({
        type: "char",
        length: 20,
        unique: true,
        nullable: true,
    })
    public digicoTradeId: string | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userRealHistorys)
    public user?: User;

    @ManyToOne(() => RealEfoRate, (realEfoRate) => realEfoRate.userRealHistories)
    public adaptedExchangeRate?: RealEfoRate;

    constructor(user: User, reason: RealReasonType, adaptedExchangeRate: RealEfoRate | null) {
        super();
        this.user = user;
        this.reason = reason;
        if (adaptedExchangeRate) {
            this.adaptedExchangeRate = adaptedExchangeRate;
        }
        this.outgoingId = "RL" + nanoid();
    }
}
