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
import { UserRoleType } from "./user_role";

@Entity()
export class UserRefreshToken extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    public token!: string;

    @Column({
        type: "datetime",
    })
    public expireAt!: Date;

    @Column({
        type: "boolean",
        default: false,
    })
    public isManagementToken: boolean = false;

    @Column({
        type: "enum",
        enum: ["admin", "recruitCompany"],
        nullable: true,
        default: null,
    })
    public role: UserRoleType | null = null;

    @Column({
        type: "bigint",
        nullable: true,
        default: null,
    })
    public recruitCompanyId: string | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    public user?: User;

    constructor(token: string, expireAt: Date) {
        super();
        this.token = token;
        this.expireAt = expireAt;
    }
}
