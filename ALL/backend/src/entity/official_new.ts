// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";
import { nanoid } from "nanoid";
import moment from "moment";

@Entity()
@Index(["priority", "beginPeriodAt", "endPeriodAt"])
export class OfficialNews extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 64,
        unique: true,
    })
    public outgoingId!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public title!: string;

    @Column({
        type: "text",
    })
    public detail!: string;

    @Column({
        type: "int",
        default: 10,
    })
    public priority: number = 10;

    @Column({
        type: "datetime",
    })
    public beginPeriodAt!: Date;

    @Column({
        type: "datetime",
    })
    public endPeriodAt!: Date;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    constructor(title: string, detail: string, beginPeriodAt: Date, endPeriodAt?: Date) {
        super();
        this.outgoingId = nanoid();
        this.title = title;
        this.detail = detail;
        this.beginPeriodAt = beginPeriodAt;
        this.endPeriodAt = endPeriodAt || moment("9999-12-31", "YYYY-MM-DD").toDate(); // TODO: 外に出す
    }
}
