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
export class UserPrivateJobHistroy extends BaseEntity {

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
    public jobHistory: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.privateJobHistories)
    public user?: User;

    constructor(user: User, targetDate: Date, jobHistory: string) {
        super();
        this.user = user;
        this.targetDate = targetDate;
        this.jobHistory = jobHistory;
        this.outgoingId = nanoid();
    }
}
