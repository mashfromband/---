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
    OneToMany,
    Index,
} from "typeorm";
import { nanoid } from "nanoid";

import { RecruitCompanyInfo } from "./recruit_company_info";
import { UserRecruitCompany } from "./user_recruit_company";
import { RecruitCompanyWantedAds } from "./recruit_company_wanted_ads";
import { RecruitCompanyCode } from "./recruit_company_code";

@Entity()
@Index(["beginPeriodAt", "endPeriodAt"])
export class RecruitCompany extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 64,
        unique: true,
    })
    public outgoingId!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public name: string;

    @Column({
        type: "datetime",
    })
    public beginPeriodAt!: Date;

    @Column({
        type: "datetime",
    })
    public endPeriodAt!: Date;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => RecruitCompanyInfo, (recruitCompanyInfo) => recruitCompanyInfo.recruitCompany)
    public info?: RecruitCompanyInfo;

    @OneToMany(() => UserRecruitCompany, (userRecruitCompany) => userRecruitCompany.recruteCompany)
    public userRecruiteCompanys?: UserRecruitCompany[];

    @OneToMany(() => RecruitCompanyWantedAds, (recruitCompanyWantedAds) => recruitCompanyWantedAds.recruteCompany)
    public recruiteCompanyWantedAds?: RecruitCompanyWantedAds[];

    @OneToOne(() => RecruitCompanyCode, (recruitCompanyCode) => recruitCompanyCode.recruitCompany)
    public companyCode?: RecruitCompanyCode;

    constructor(name: string) {
        super();
        this.name = name;
        this.outgoingId = nanoid();
    }
}
