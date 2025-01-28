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

import { User } from "./user";
import { SkillDomain } from "./skill_domain";

@Index(["user", "skillDomain"], { unique: true })
@Entity()
export class UserSkillDomain extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 0,
    })
    public clearCount: number = 0;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userSkills)
    public user?: User;

    @ManyToOne(() => SkillDomain, (skillDomain) => skillDomain.userSkillDomains)
    public skillDomain?: SkillDomain;

    constructor(user: User, skillDomain: SkillDomain) {
        super();
        this.user = user;
        this.skillDomain = skillDomain;
    }
}
