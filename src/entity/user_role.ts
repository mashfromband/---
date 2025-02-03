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

export type UserRoleType = "admin" | "recruitCompany";

@Entity()
export class UserRole extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "enum",
        enum: ["admin", "recruitCompany"],
    })
    public role: UserRoleType;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userRoles)
    public user?: User;

    constructor(user: User, role: UserRoleType) {
        super();
        this.user = user;
        this.role = role;
    }
}
