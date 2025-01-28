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
    Index,
} from "typeorm";
import { nanoid } from "nanoid";

import { RecruitCompany } from "./recruit_company";

@Entity()
@Index(["beginAt", "endAt"])
@Index(["updatedAt"])
export class RecruitCompanyWantedAds extends BaseEntity {

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
        length: 128,
    })
    public title!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public position!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public workLocation!: string;

    @Column({
        type: "varchar",
        length: 64,
    })
    public employmentStatus!: string;

    @Column({
        type: "varchar",
        length: 32,
    })
    public numberOfPeople!: string;

    @Column({
        type: "text",
    })
    public details!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public requirements!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public salaryAndBenefits!: string;

    @Column({
        type: "varchar",
        length: 128,
    })
    public officeHour!: string;

    @Column({
        type: "varchar",
        length: 128,
    })
    public dayOff!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public welfareProgram!: string;

    @Column({
        type: "varchar",
        length: 128,
    })
    public howToApply!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public applicationDocuments!: string;

    @Column({
        type: "datetime",
    })
    public applicationDeadline!: Date;

    @Column({
        type: "datetime",
    })
    public beginAt!: Date;

    @Column({
        type: "datetime",
    })
    public endAt!: Date;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => RecruitCompany, (recruitCompany) => recruitCompany.recruiteCompanyWantedAds)
    public recruteCompany?: RecruitCompany;

    constructor(recruteCompany: RecruitCompany) {
        super();
        this.recruteCompany = recruteCompany;
        this.outgoingId = nanoid();
    }
}
