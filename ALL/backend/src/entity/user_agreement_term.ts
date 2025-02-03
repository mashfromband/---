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
import { Term } from "./term";

@Entity()
export class UserAgreementTerm extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "datetime",
    })
    public agreedAt: Date;

    @Column({
        type: "int",
    })
    public agreedVersion: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userAgreementTerms)
    public user?: User;

    @ManyToOne(() => Term, (term) => term.userAgreementTerms)
    public term?: Term;

    constructor(user: User, term: Term, agreedAt: Date, agreedVersion: number) {
        super();
        this.user = user;
        this.term = term;
        this.agreedAt = agreedAt;
        this.agreedVersion = agreedVersion;
    }
}
