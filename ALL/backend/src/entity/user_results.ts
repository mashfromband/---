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

import { User } from "./user";

@Entity()
export class UserResults extends BaseEntity {

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

    @Column({
        type: "int",
        default: 0,
    })
    public playQuestCount: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public clearQuestCount: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalScore: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public point: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalAnswerCount: number = 0;

    @Column({
        type: "int",
        default: 0,
    })
    public totalCorrectAnswerCount: number = 0;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => User, (user) => user.results)
    @JoinColumn()
    public user?: User;

    constructor(user: User) {
        super();
        this.user = user;
    }
}
