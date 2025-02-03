// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";

import { Quest } from "./quest";
import { MissionTag } from "./mission_tag";

export type MissionAnswerType = "one_choice" | "multi_choice";

@Entity()
export class Mission extends BaseEntity {

    @PrimaryColumn({
        type: "char",
        length: 38,
    })
    readonly id: string; // SHA-224

    @Column({
        type: "int",
    })
    public index: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    public questionPath: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public optionPath: string;

    @Column({
        type: "enum",
        enum: ["one_choice", "multi_choice"],
    })
    public answerType?: MissionAnswerType;

    @Column({
        type: "json",
    })
    public correct?: any;

    @Column({
        type: "varchar",
        length: 255,
    })
    public correctCommentaryPath: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public wrongCommentaryPath: string;

    @Column({
        type: "int",
    })
    public score: number;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => Quest, (quest) => quest.missions)
    @JoinColumn()
    public quest?: Quest;

    @OneToMany(() => MissionTag, (missionTag) => missionTag.mission)
    public tags?: MissionTag[];

    constructor(
        id: string, quest: Quest, index: number,
        answerType: MissionAnswerType, correct: any,
        questionPath: string, optionPath: string,
        correctCommentaryPath: string,
        wrongCommentaryPath: string,
        score: number,
    ) {
        super();
        this.id = id;
        this.quest = quest;
        this.index = index;
        this.answerType = answerType;
        this.correct = correct;
        this.questionPath = questionPath;
        this.optionPath = optionPath;
        this.correctCommentaryPath = correctCommentaryPath;
        this.wrongCommentaryPath = wrongCommentaryPath;
        this.score = score;
    }
}
