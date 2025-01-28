// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";

import { UserAgreementTerm } from "./user_agreement_term";

@Entity()
export class Term extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public termName: string;

    @Column({
        type: "int",
    })
    public currentVersion: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => UserAgreementTerm, (userAgreementTerm) => userAgreementTerm.term)
    public userAgreementTerms?: UserAgreementTerm[];

    constructor(termName: string, currentVersion: number) {
        super();
        this.termName = termName;
        this.currentVersion = currentVersion;
    }
}
