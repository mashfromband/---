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
import { Skill } from "./skill";

@Index(["user", "skill"], { unique: true })
@Entity()
export class UserSkill extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "int",
        default: 1,
    })
    public level: number = 1;

    @Column({
        type: "int",
        default: 0,
    })
    public exp: number = 0;

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

    @ManyToOne(() => Skill, (skill) => skill.userSkills)
    public skill?: Skill;

    constructor(user: User, skill: Skill) {
        super();
        this.user = user;
        this.skill = skill;
    }
}
