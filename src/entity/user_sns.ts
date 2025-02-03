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
import { Sns } from "./sns";

@Entity()
export class UserSns extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public url: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.userSns)
    public user?: User;

    @ManyToOne(() => Sns, (sns) => sns.userSns)
    public sns?: Sns;

    constructor(user: User, sns: Sns, url: string) {
        super();
        this.user = user;
        this.sns = sns;
        this.url = url;
    }
}
