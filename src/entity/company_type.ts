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
    PrimaryColumn,
} from "typeorm";

import { RecruitCompanyInfo } from "./recruit_company_info";

@Entity()
export class CompanyType extends BaseEntity {

    @PrimaryColumn({
        type: "int",
    })
    readonly id: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    public name: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => RecruitCompanyInfo, (recruitCompanyInfo) => recruitCompanyInfo.companyType)
    public recruitCompanyInfos?: RecruitCompanyInfo[];

    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
}
