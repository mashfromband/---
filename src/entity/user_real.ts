// -*- coding: utf-8 -*-

//-------------------------------------------------------------------------
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//-------------------------------------------------------------------------
// このクラスは廃止予定です。
// 使用してはいけません。
//-------------------------------------------------------------------------
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//-------------------------------------------------------------------------

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

import { User } from "./user";

export type RealType =
    "normal"; // 通常

@Entity()
export class UserReal extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 0,
    })
    public addReal: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public consumeReal: number = 0;

    @Column({
        type: "enum",
        enum: [
            "normal",
        ],
        default: "normal",
    })
    readonly type: RealType = "normal";

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

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userReals)
    public user?: User;

    constructor(user: User, realType: RealType) {
        super();
        this.user = user;
        this.type = realType;
    }
}
