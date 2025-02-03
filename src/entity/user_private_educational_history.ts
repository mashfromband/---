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

@Entity()
export class UserPrivateEducationalHistory extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 64,
        unique: true,
    })
    readonly outgoingId: string;

    @Column({
        type: "datetime",
    })
    public targetDate: Date;

    @Column({
        type: "varchar",
        length: 255,
    })
    public educationalHistoery: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.privateEducationalHistories)
    public user?: User;

    constructor(user: User, targetDate: Date, educationalHistoery: string) {
        super();
        this.user = user;
        this.targetDate = targetDate;
        this.educationalHistoery = educationalHistoery;
        this.outgoingId = nanoid();
    }
}
