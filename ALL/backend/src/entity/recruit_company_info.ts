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
    ManyToOne,
} from "typeorm";

import { RecruitCompany } from "./recruit_company";
import { CompanyType } from "./company_type";

@Entity()
export class RecruitCompanyInfo extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public displayName!: string;

    @Column({
        type: "datetime",
    })
    public establishmentDate!: Date;

    @Column({
        type: "varchar",
        length: 16,
    })
    public postalCode!: string;

    @Column({
        type: "int",
    })
    public prefectureCode!: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    public address!: string;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public phoneNumber!: string;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public faxNumber: string | null = null;

    @Column({
        type: "varchar",
        length: 255,
    })
    public officialSiteUrl!: string;

    @Column({
        type: "text",
    })
    public profile!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public employees!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public netSales!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public contactPersonName!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public contactPersonPosition!: string;

    @Column({
        type: "varchar",
        length: 16,
    })
    public contactPersonPhoneNumber!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public contactPersionMailAddress!: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => RecruitCompany, (recruitCompany) => recruitCompany.info)
    @JoinColumn()
    public recruitCompany?: RecruitCompany;

    @ManyToOne(() => CompanyType, (companyType) => companyType.recruitCompanyInfos)
    public companyType?: CompanyType;

    constructor(recruitCompany: RecruitCompany) {
        super();
        this.recruitCompany = recruitCompany;
    }
}
