// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    PrimaryColumn,
} from "typeorm";

import { UserSkill } from "./user_skill";

@Entity()
export class Skill extends BaseEntity {

    @PrimaryColumn({
        type: "varchar",
        length: "128",
    })
    readonly id: string;

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

    @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
    public userSkills?: UserSkill[];

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
}
