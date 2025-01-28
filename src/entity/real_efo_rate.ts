// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { UserRealHistory } from "./user_real_history";

@Entity()
export class RealEfoRate extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
    })
    public oneRealToEfo!: number;

    @Column({
        type: "boolean",
    })
    public isDefaultRate!: boolean;

    @Column({
        type: "datetime",
        nullable: true,
    })
    public periodBeginAt: Date | null = null;

    @Column({
        type: "datetime",
        nullable: true,
    })
    public periodEndAt: Date | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => UserRealHistory, (userRealHistory) => userRealHistory.adaptedExchangeRate)
    public userRealHistories?: UserRealHistory[];

    constructor() {
        super();
    }
}
