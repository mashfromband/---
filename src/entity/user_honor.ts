// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
    Column,
} from "typeorm";

import { User } from "./user";
import { Honor } from "./honor";

@Index(["user", "honor"], { unique: true })
@Entity()
export class UserHonor extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "boolean",
        default: false,
    })
    public isSet: boolean = false;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userHonors)
    public user?: User;

    @ManyToOne(() => Honor, (honor) => honor.userHonors)
    public honor?: Honor;

    constructor(user: User, honor: Honor) {
        super();
        this.user = user;
        this.honor = honor;
    }
}
