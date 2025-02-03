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
export class DigicoLimit extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
    })
    public limitExchangeDigicoDaily: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    constructor(limitExchangeDigicoDaily: number) {
        super();
        this.limitExchangeDigicoDaily = limitExchangeDigicoDaily;
    }
}
