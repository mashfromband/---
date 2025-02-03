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

import { UserSkillDomain } from "./user_skill_domain";
import { Quest } from "./quest";

@Entity()
export class SkillDomain extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
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

    @OneToMany(() => UserSkillDomain, (userSkillDomain) => userSkillDomain.skillDomain)
    public userSkillDomains?: UserSkillDomain[];

    @OneToMany(() => Quest, (quest) => quest.skillDomain)
    public quests?: Quest[];

    constructor(name: string) {
        super();
        this.name = name;
    }
}
