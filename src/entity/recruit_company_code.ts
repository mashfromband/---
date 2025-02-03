// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";

import { RecruitCompany } from "./recruit_company";

@Entity()
export class RecruitCompanyCode extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 16,
        unique: true,
    })
    public companyCode!: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => RecruitCompany, (recruitCompany) => recruitCompany.companyCode)
    @JoinColumn()
    public recruitCompany?: RecruitCompany;

    constructor(recruitCompany: RecruitCompany, code: string) {
        super();
        this.recruitCompany = recruitCompany;
        this.companyCode = code;
    }
}
