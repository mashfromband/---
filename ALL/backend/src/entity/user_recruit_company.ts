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
import { RecruitCompany } from "./recruit_company";

@Entity()
export class UserRecruitCompany extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "boolean",
        default: false,
    })
    public receverApplyJobFromUser: boolean = false; // MEMO: 本当は求人企業ごと 1 名のみに DB 上で制限したいが、コード側で制御する

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userRecruitCompanys)
    public user?: User;

    @ManyToOne(() => RecruitCompany, (recruitCompany) => recruitCompany.userRecruiteCompanys)
    public recruteCompany?: RecruitCompany;

    constructor(user: User, recruitCompany: RecruitCompany) {
        super();
        this.user = user;
        this.recruteCompany = recruitCompany;
    }
}
