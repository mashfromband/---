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
    OneToMany,
} from "typeorm";
import { nanoid } from "nanoid";

import { UserProfile } from "./user_profile";
import { UserPrivateProfile } from "./user_private_profile";
import { UserRefreshToken } from "./user_refresh_token";
import { UserPrivateJobHistroy } from "./user_private_job_history";
import { UserPrivateEducationalHistory } from "./user_private_educational_history";
import { UserPrivateHaveLicense } from "./user_private_have_license_history";
import { UserAgreementTerm } from "./user_agreement_term";
import { UserSns } from "./user_sns";
import { UserRole } from "./user_role";
import { UserRecruitCompany } from "./user_recruit_company";
import { UserQuestHistory } from "./user_quest_history";
import { UserResults } from "./user_results";
import { UserSkill } from "./user_skill";
import { UserSkillDomain } from "./user_skill_domain";
import { UserEfoHistory } from "./user_efo_history";
import { UserRealHistory } from "./user_real_history";
import { UserEfo } from "./user_efo";
import { UserReal } from "./user_real";
import { UserHaveEfo } from "./user_have_efo";
import { UserHaveReal } from "./user_have_real";
import { UserDigicoHistory } from "./user_digico_history";
import { UserHonor } from "./user_honor";
import { MessageRoomPost } from "./message_room_post";

@Entity()
export class User extends BaseEntity {

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
        unique: true,
    })
    public mailAddress: string;

    @Column({
        type: "varchar",
        length: 128,
    })
    public passwordHash: string;

    @Column({
        type: "boolean",
        default: true,
    })
    public isValid: boolean = true;

    @Column({
        type: "datetime",
        nullable: true,
        default: null,
    })
    public withdrawaledAt: Date | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    // MEMO: 削除はないはずだが入れておく
    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => UserResults, (userResults) => userResults.user)
    public results?: UserResults;

    @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
    public profile?: UserProfile;

    @OneToOne(() => UserPrivateProfile, (userPrivateProfile) => userPrivateProfile.user)
    public privateProfile?: UserPrivateProfile;

    @OneToMany(() => UserRefreshToken, (userRefreshToken) => userRefreshToken.user)
    public refreshTokens?: UserRefreshToken[];

    @OneToMany(() => UserPrivateJobHistroy, (userPrivateJobHistory) => userPrivateJobHistory.user)
    public privateJobHistories?: UserPrivateJobHistroy[];

    @OneToMany(() => UserPrivateEducationalHistory, (userPrivateEducationalHistory) => userPrivateEducationalHistory.user)
    public privateEducationalHistories?: UserPrivateEducationalHistory[];

    @OneToMany(() => UserPrivateHaveLicense, (userPrivateHaveLicense) => userPrivateHaveLicense.user)
    public privateHaveLicenses?: UserPrivateHaveLicense[];

    @OneToMany(() => UserAgreementTerm, (userAgreementTerm) => userAgreementTerm.user)
    public userAgreementTerms?: UserAgreementTerm[];

    @OneToMany(() => UserSns, (userSns) => userSns.user)
    public userSns?: UserSns[];

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    public userRoles?: UserRole[];

    @OneToMany(() => UserRecruitCompany, (userRecruitCompany) => userRecruitCompany.user)
    public userRecruitCompanys?: UserRecruitCompany[];

    @OneToMany(() => UserQuestHistory, (userQuestHistory) => userQuestHistory.user)
    public questHistories?: UserQuestHistory[];

    @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
    public userSkills?: UserSkill[];

    @OneToMany(() => UserSkillDomain, (userSkillDomain) => userSkillDomain.user)
    public userSkillDomains?: UserSkillDomain[];

    @OneToMany(() => UserEfoHistory, (userEfoHistory) => userEfoHistory.user)
    public userEfoHistorys?: UserEfoHistory[];

    //-------------------------------------------------------------------------
    // WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
    //-------------------------------------------------------------------------
    // 使用してはいけません。
    @OneToMany(() => UserEfo, (userEfo) => userEfo.user)
    public userEfos?: User[];
    //-------------------------------------------------------------------------
    // WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
    //-------------------------------------------------------------------------

    @OneToMany(() => UserHaveEfo, (userHaveEfo) => userHaveEfo.user)
    public userHaveEfos?: UserHaveEfo[];

    @OneToMany(() => UserRealHistory, (userRealHistory) => userRealHistory.user)
    public userRealHistorys?: UserRealHistory[];

    //-------------------------------------------------------------------------
    // WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
    //-------------------------------------------------------------------------
    // 使用してはいけません。
    @OneToMany(() => UserReal, (userReal) => userReal.user)
    public userReals?: UserReal[];
    //-------------------------------------------------------------------------
    // WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
    //-------------------------------------------------------------------------

    @OneToMany(() => UserHaveReal, (userHaveReal) => userHaveReal.user)
    public userHaveReals?: UserHaveReal[];

    @OneToMany(() => UserDigicoHistory, (userDigicoHistory) => userDigicoHistory.user)
    public userDigicoHistories? : UserDigicoHistory[];

    @OneToMany(() => UserHonor, (userHonor) => userHonor.user)
    public userHonors?: UserHonor[];

    @OneToMany(() => MessageRoomPost, (messageRoomPost) => messageRoomPost.postUser)
    public messageRoomPosts?: MessageRoomPost[];

    constructor(mailAddress: string, passwordHash: string) {
        super();
        this.mailAddress = mailAddress;
        this.passwordHash = passwordHash;
        this.outgoingId = nanoid();
    }
}
