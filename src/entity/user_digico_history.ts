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

import { User } from "./user";

@Entity()
export class UserDigicoHistory extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "char",
        length: 20,
        unique: true,
    })
    public digicoTradeId!: string;

    @Column({
        type: "int",
    })
    public digicoGiftIdentifyCode!: number;

    @Column({
        type: "int",
        default: 1
    })
    public digicoAmount: number = 1;

    @Column({
        type: "datetime",
    })
    public digicoRequestedAt!: Date;

    @Column({
        type: "varchar",
        length: 32,
    })
    public digicoGiftCode!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public digicoGiftUrl!: string;

    @Column({
        type: "datetime",
    })
    public digicoExpireDate!: Date;

    @Column({
        type: "char",
        length: 20,
    })
    public digicoManageCode!: string;

    @Column({
        type: "datetime",
    })
    public digicoSendTime!: Date;

    @Column({
        type: "int",
    })
    public consumeReal?: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userDigicoHistories)
    public user?: User;

    constructor(user: User) {
        super();
        this.user = user;
    }
}
