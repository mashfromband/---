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
} from "typeorm";
import { UserProfile } from "./user_profile";

@Entity()
export class UserIcon extends BaseEntity {

    @PrimaryColumn({
        type: "int",
    })
    readonly id!: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    public iconPath: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => UserProfile, (userProfile) => userProfile.userIcon)
    public userProfiles?: UserProfile[];

    constructor(id: number, iconPath: string) {
        super();
        this.id = id;
        this.iconPath = iconPath;
    }
}
