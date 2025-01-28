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

export type EfoType = 
    "questClear" | // クエストクリア
    "free"; // 無料

@Entity()
export class UserEfo extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 0,
    })
    public addEfo: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public consumeEfo: number = 0;

    @Column({
        type: "enum",
        enum: [
            "questClear",
            "free",
        ]
    })
    readonly type: EfoType;

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

    @ManyToOne(() => User, (user) => user.userEfos)
    public user?: User;

    constructor(user: User, efoType: EfoType) {
        super();
        this.user = user;
        this.type = efoType;
    }
}
