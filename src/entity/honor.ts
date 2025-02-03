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

import { UserHonor } from "./user_honor";

@Entity()
export class Honor extends BaseEntity {

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

    @Column({
        type: "varchar",
        length: 255,
    })
    public detail: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => UserHonor, (userHonor) => userHonor.honor)
    public userHonors?: UserHonor[];

    constructor(id: string, name: string, detail: string) {
        super();
        this.id = id;
        this.name = name;
        this.detail = detail;
    }
}
