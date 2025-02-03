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

export type SexType = "male" | "female";

@Entity()
export class UserPrivateProfile extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public name: string | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public nameCalling: string | null = null;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public postalCode: string | null = null;

    @Column({
        type: "int",
        nullable: true,
        default: null,
    })
    public prefectureCode: number | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public address: string | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public addressCalling: string | null = null;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public phoneNumber: string | null = null;

    @Column({
        type: "enum",
        enum: ["male", "female"],
        nullable: true,
        default: null,
    })
    public sex: SexType | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public rewardsAndPunishments: string | null = null;

    @Column({
        type: "varchar",
        length: 128,
        nullable: true,
        default: null,
    })
    public picturePath: string | null = null;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public contactPostalCode: string | null = null;

    @Column({
        type: "int",
        nullable: true,
        default: null,
    })
    public contactPrefectureCode: number | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public contactAddress: string | null = null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        default: null,
    })
    public contactAddressCalling: string | null = null;

    @Column({
        type: "varchar",
        length: 16,
        nullable: true,
        default: null,
    })
    public contactPhoneNumber: string | null = null;

    @Column({
        type: "datetime",
        nullable: true,
        default: null,
    })
    public birthDay: Date | null = null;

    @Column({
        type: "text",
        nullable: true,
        default: null
    })
    public appealPoint: string | null = null;

    @Column({
        type: "text",
        nullable: true,
        default: null
    })
    public wishes: string | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => User, (user) => user.privateProfile)
    @JoinColumn()
    public user?: User;

    constructor(user: User) {
        super();
        this.user = user;
    }
}
