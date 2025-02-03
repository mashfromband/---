// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";

import { CategoryQuest } from "./category_quest";
import { Mission } from "./mission";
import { QuestTag } from "./quest_tag";
import { UserQuestHistory } from "./user_quest_history";
import { SkillDomain } from "./skill_domain";

@Entity()
export class Quest extends BaseEntity {

    @PrimaryColumn({
        type: "char",
        length: 38,
    })
    readonly id: string; // SHA-224

    @Column({
        type: "varchar",
        length: 128,
    })
    public name: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public detail: string;

    @Column({
        type: "boolean",
        default: false,
    })
    public disableBackWrongAnswer: boolean = false;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => CategoryQuest, (categoryQuest) => categoryQuest.quest)
    public categoryQuests?: CategoryQuest[];

    @OneToMany(() => Mission, (mission) => mission.quest)
    public missions?: Mission[];

    @OneToMany(() => QuestTag, (questTag) => questTag.quest)
    public tags?: QuestTag[];

    @OneToMany(() => UserQuestHistory, (userQuestHistory) => userQuestHistory.quest)
    public userHistories?: UserQuestHistory[];

    @ManyToOne(() => SkillDomain, (skillDomain) => skillDomain.quests)
    public skillDomain?: SkillDomain;

    constructor(id: string, name: string, detail: string, skillDomain: SkillDomain) {
        super();
        this.id = id;
        this.name = name;
        this.detail = detail;
        this.skillDomain = skillDomain;
    }
}
