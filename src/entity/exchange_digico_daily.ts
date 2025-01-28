// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class ExchangeDigicoDaily extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "datetime",
        unique: true,
    })
    readonly targetDate: Date;

    @Column({
        type: "int",
        default: 0,
    })
    public totalExchangeDigico: number = 0;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    constructor(targetDate: Date) {
        super();
        this.targetDate = targetDate;
    }
}
