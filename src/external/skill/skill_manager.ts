/*==========================*/
import * as fs from 'fs';
import * as path from 'path';
import JSON5 from 'json5';

import * as DBG from "./dbg"
import * as UTL from "./utl"

const skill_dat_path		= './test_dat/skill_dat.json5';
const skill_domtree_path	= './test_dat/skill_domain_tree.json';



export interface TypeUser {
	id: string;
	name: string;
	level_num: number;
	exp: number;
	quest_clear_count: number;

	quest_clear_dom_num?: TypeQuestClearNum;

//	score: number;
	total_score: number;
	point: number;
	skills: TypeUserDatSkill[];
	honors: TypeUserDatHonor[];
} // interface TypeUser

export type TypeQuestClearNum = Record<string, number>;

export interface TypeSkillBasicInf {
	"str_id"					:	string;	// 文字列のID
	"dispname_jp"				:	string;	// スキルの名前
	"domain"					:	string;	// ユーザースキル。全domain問題で獲得・効果・レベリング
	"unlock_judge_timing"?		: 	string;
	"unlock_judge_conditions"?	:	{ [key: string]: any}[];
};/*	TypeSkillBasicInf	*/

export interface TypeUserDatSkill {
	"str_id"			:	string;
	"exp"				:	number;
	"level_num"			:	number;
}/*	TypeUserDatSkill	*/
interface TypeUserDatHonor {
	"str_id"			:	string;
}/*	TypeUserDatHonor	*/

interface TypeSkillDat {
	"basic_inf"?		:	TypeSkillBasicInf;
	"unlock_inf"?		:	any;
	"leveling_inf"?	:	any;
}/*	TypeSkillDat	*/

interface TypeBasicInfHash {
	[key: string]: TypeSkillBasicInf;
}/*	TypeBasicInfHash	*/

interface TypeSkillHashDat {
	[key: string]: TypeSkillDat;
}/*	TypeSkillHashDat	*/

type TypeJsonHashAny = { [key: string]: any };
type TypeJsonValue = string | number | boolean | null | TypeJsonObject | TypeJsonArray;
interface TypeJsonObject {
    [key: string]: TypeJsonValue;
}/*	TypeJsonObject	*/
interface TypeJsonArray extends Array<TypeJsonValue> {};



/*==========================*/
/*	class	SkillManager	*/
/*==========================*/
export class SkillManager {
	private	static instance: SkillManager;

	private	constructor() {}					/*	constructor	*/

	/*	全てのskillのbasic_infはここにonメモリキャッシュ	*/
	private	allBasicInfs:			TypeBasicInfHash | null		= null;
//	private	domainParentDomains: Record<string, string[]>			= {};  /* スキル毎の親ドメインを保持	*/
	private	domainParentDomains: Record<string, string[]> | null	= null;  /* スキル毎の親ドメインを保持	*/

	/*	redisの様にキャッシュ								*/
	private	_like_redis_cache: { [key: string]: any } | null = null;

	/*	filepath	*/
	private	_skill_dat_filepath		= skill_dat_path;
	private	_skill_domtree_filepath	= skill_domtree_path;

	/*	OnMemoryCache	*/
	private	_skillDatCache: TypeSkillHashDat | null					= null;
	private	_skillDatOnMemoryFlag									= false;

	/****************************/
	/*	初期化は同期処理のまま	*/
	/****************************/
	public static getInstance(
						skillDatOnMemoryFlag = true,
						argSkillDatPath?: string, 
						argSkillDomTreePath?: string
				): SkillManager {
		if (!SkillManager.instance) {
			SkillManager.instance = new SkillManager();
		}

		this.instance._skillDatOnMemoryFlag	= skillDatOnMemoryFlag;
		if (argSkillDatPath) {
			this.instance._skill_dat_filepath		= argSkillDatPath;
		}
		if (argSkillDomTreePath) {
			this.instance._skill_domtree_filepath	= argSkillDomTreePath;
		}

		/*	初期化時に読むようにする	*/
		if (!this.instance.allBasicInfs) {
			/*	DBかFileから読むSTUB	*/
			/*	jObjは都度捨てる		*/
			this.instance.allBasicInfs = this.instance._readSkillDatToAllBasicInfsSync();

            // 親ドメインマップを構築
			this.instance.domainParentDomains = this.instance.loadBuildParentDomainMapSync(); 
		}
		return SkillManager.instance;
	}/*	getInstance()	*/




	private loadBuildParentDomainMapSync() : Record<string, string[]> {
		const	skDomTree = this._readSkillDomainTreeDatJsonObjFromFileSync();
		const	resultHash: Record<string, string[]> = {};
//DBG.VAL(skDomTree, "skDomTree");

		/*	各ドメインの親ドメインを全てキャッシュして置く	*/
		this.readDomainSkillsAndChildDomains(skDomTree, resultHash, [] as string[]);
DBG.VAL(resultHash, "全ドメインの親ドメイン");
		return	resultHash
	}/*	loadBuildParentDomainMapSync()	*/
	private async loadBuildParentDomainMapAsync() : Promise<Record<string, string[]>> {
		const	skDomTree = await this._readSkillDomainTreeDatJsonObjFromFileAsync();
		const	resultHash: Record<string, string[]> = {};
//DBG.VAL(skDomTree, "skDomTree");

		/*	各ドメインの親ドメインを全てキャッシュして置く	*/
		this.readDomainSkillsAndChildDomains(skDomTree, resultHash, [] as string[]);
DBG.VAL(resultHash, "全ドメインの親ドメイン");
		return	resultHash
	}/*	loadBuildParentDomainMapAsync()	*/

	/*	各ドメインの親ドメインを全てキャッシュして置く	*/
	private readDomainSkillsAndChildDomains(
					cObj: TypeJsonObject, 
					resultHash: Record<string, string[]>, 
					parentDomainAry: string[]
			): void {


		Object.keys(cObj).forEach(domainName => {

			resultHash[domainName]	= [...parentDomainAry];			/* shallowCopy	*/


			const domObj = cObj[domainName] as TypeJsonHashAny;
			if (domObj?.childDomains) {
				this.readDomainSkillsAndChildDomains(domObj.childDomains, resultHash, [...parentDomainAry, domainName]);
			}
		});
	}/*	readDomainSkillsAndChildDomains()	*/


	public getCacheSize(): Record<string, number> {
		const	cacheKey = [
			"allBasicInfs",
			"domainParentDomains",
			"_like_redis_cache",
			"_skillDatCache"
		];
		const result: Record<string, number> = {};
		cacheKey.forEach(key => {
			result[key] = UTL.getRecursiveMemorySizeOfObject(this[key as keyof SkillManager], ("_skillDatCache" == key));
		});
//DBG.VAL(result, "result");
		return	result;
	}/*	getCacheSize()	*/

	public cacheClear(calcCacheSizeFlag = false): Record<string, number> | null {
		let result = calcCacheSizeFlag? this.getCacheSize() : null;

DBG.INF("CacheClear: allBasicInfs\t(%s Bytes)", result?.allBasicInfs || "--");
		this.allBasicInfs			= null;
DBG.INF("CacheClear: domainParentDomains\t(%s Bytes)", result?.domainParentDomains || "--");
		this.domainParentDomains	= null;
DBG.INF("CacheClear: _like_redis_cache\t(%s Bytes)", result?._like_redis_cache || "--");
		this._like_redis_cache		= null;
DBG.INF("CacheClear: _skillDatCache\t(%s Bytes)", result?._skillDatCache || "--");
		this._skillDatCache			= null

		return	result;
	}/*	cacheClear()	*/




	/*==========================================*/
	/*	スキルを考慮した経験値、ポイント処理	*/
	/*		userデータとaddデータから処理		*/
	/*==========================================*/
	public async skillCheck(
				timingAry: string[], 
				user: TypeUser, 
				srcAdd: any
			): Promise<{ result: any, user: TypeUser, effectedAdd: Record< string, unknown >}> {


		/*	 結果を保持するオブジェクト	*/
		let result: Record<string, any> = [];

		/*	コピーしておく	*/
		const	add = UTL.deepCopy(srcAdd);

		const	cAddDomain = add.domain || "USER";			/* 何の問題を解いたか	*/

		/************************************/
		/*	全スキルデータの基本情報を取得	*/
		/************************************/
		/*	全basic_inf取得	*/
		const allBasicInfs: TypeBasicInfHash = await this.getSkillDatByKeyArray(["*", "basic_inf"]) as unknown as TypeBasicInfHash;
DBG.PF("基本情報cache(全)スキル:\t[ %s ]", Object.keys(allBasicInfs));

		/****************************************************/
		/*	解いたクエストのドメインで考慮するスキルを絞る	*/
		/****************************************************/
		/*	ドメインと、全basic_infから考慮すべきスキルを抜き出す	*/
		const skillsInAddDomAllAndUserDom = filterHash(allBasicInfs, binf => {
//DBG.VAL(cAddDomain, "cAddDomain");
//DBG.VAL(binf, "binf");
//DBG.VAL(binf.domain, "binf.domain");
			return (binf.domain === "USER") || (binf.domain === cAddDomain);	/* ユーザードメインと解いたドメインに絞る	*/
		});
DBG.PF("ドメイン一致スキル(=USER,%s):\t[ %s ]", cAddDomain, Object.keys(skillsInAddDomAllAndUserDom));

		/********************************************************/
		/*	timingでもフィルタリングする						*/
		/*		systemからプレゼントとか特殊なのを排除する目的	*/
		/********************************************************/
		/*	timingから必要なスキルを抜き出す						*/
		const skillsMatchTiming = filterHash(skillsInAddDomAllAndUserDom, binf => {
			const cTiming = binf.unlock_judge_timing;
//DBG.VAL(cTiming, "cTiming");
			/* タイミング設定の無いskillを残す(ユーザーレベルとか)	*/
			/* どれかに一致するskillなら残す						*/
			return	(!cTiming) || timingAry.some(timing => timing === cTiming)
		});
DBG.PF("timing一致スキル(=%s):\t[ %s ]", timingAry, Object.keys(skillsMatchTiming));

		/********************************************/
		/*	獲得判定をする条件を考慮する			*/
		/*		ユーザー情報からフィルター可能に	*/
		/********************************************/
		/*	unlock_judge_conditionsからUnlock判定が必要なスキルを抜き出す		*/
		const skillsToUnlockJudge = filterHash(skillsMatchTiming, (binf, skKey) => {
DBG.PF("%s: ", binf.str_id);
			const unlJdgCnds = binf.unlock_judge_conditions;
			const ret = !unlJdgCnds || this.checkUnlockConditions(unlJdgCnds, user, cAddDomain);
DBG.PF(" UnlockJudge判定: %s", ret);
			return ret;
		});
DBG.PF("UnlockJudge判定スキル:\t[ %s ]", Object.keys(skillsToUnlockJudge));


		/************************************************************/
		/*	ユーザーが持ってるスキルのeffectsをaddに反映			*/
		/************************************************************/
DBG.VAL(add, "add");
		let levelEffectedAdd: Record< string, unknown > = add;
		const userHasSkillNames = user.skills.map(skl => skl.str_id);
DBG.PF("effectAdd: 所持スキル: [ %s ]", userHasSkillNames);
		for (const sklDat of user.skills) {
			const skillKey = sklDat.str_id

			/*	所持スキルのレベリング	*/
			/*	先にまとめて読んでおく	*/
			const lvlInf = await this.getSkillDatByKeyArray([skillKey, "leveling_inf"]);

DBG.PF("  %s: ", skillKey);
			levelEffectedAdd = await this.effectAddByUserSkill(levelEffectedAdd, sklDat, add, result, user);
		}
DBG.VAL(levelEffectedAdd, "levelEffectedAdd");

		/************************************************/
		/*	所持スキル効果付のaddをユーザーデータに反映	*/
		/************************************************/
		let addedUser  = await this.effectAddUser(user, levelEffectedAdd, result);
//DBG.VAL(addedUser, "addedUser");

		/************************************************************/
		/*	ユーザーが持ってるスキルのleveling						*/
		/************************************************************/
		for (const sklDat of addedUser.skills) {
			const skillKey = sklDat.str_id
DBG.PF("レベリング: %s: ", skillKey);
			addedUser = await this.userLeveling(sklDat, add, result, addedUser);
		}

		/************************************/
		/*	獲得判定するスキルを判定		*/
		/************************************/
		/*	必要なunlock_infを取得									*/
DBG.PF("Unlock判定開始: %s", Object.keys(skillsToUnlockJudge));
		for (const skillKey of Object.keys(skillsToUnlockJudge)) {
			const unlockInf = await this.getSkillDatByKeyArray([skillKey, "unlock_inf"]) as TypeJsonHashAny;

DBG.PF("%s: ", skillKey);
//DBG.VAL(unlockInf, "unlockInf");
			/*	スキル獲得の判定	*/
			if (unlockInf && this.checkUnlockConditions(unlockInf.conditions_and, addedUser, cAddDomain)) {
				/*	獲得スキルをユーザーデータと結果に反映	*/
				addedUser = this.setUnlockUserResult(skillKey, addedUser, result, unlockInf.result);
			}
		}

//DBG.INF("_like_redis_cache size: %d Bytes", UTL.getRecursiveMemorySizeOfObject(this._like_redis_cache));

		return { 
			result				:	result, 
			user				:	addedUser, 
			effectedAdd			:	levelEffectedAdd,
		};
	}/*	skillCheck()	*/




	/*	キー配列からSkillDatの必要データを取得してRedisにキャッシュ	*/
	private async getSkillDatByKeyArray(keyAry: (string | number)[]): Promise<TypeJsonValue> {
		this._like_redis_cache = this._like_redis_cache || {};
		let	result: TypeJsonValue | null = null;

		const keysStr = keyAry.join(",");

		/*	[ "*", "basic_inf"]	は、allBasicInfsに	*/
		if ("*,basic_inf" == keysStr) {
			if (!this.allBasicInfs) {
				/*	DBかFileから読むSTUB	*/
				/*	jObjは都度捨てる		*/
				this.allBasicInfs = await this._readSkillDatToAllBasicInfsAsync();
			}
			result = this.allBasicInfs as unknown as TypeJsonValue;
		}
		else {
			if (keysStr in this._like_redis_cache) {
				result = this._like_redis_cache[keysStr];
			}
			else {
				let found = false;
				if (3 <= keyAry.length) {
					/*	3以上なら短いキャッシュを探す	*/
					let ckstr: string = "";
					let parentObj: TypeJsonObject | null = null;
					let	i;
					for (i = keyAry.length - 1; 0 <= i; i--) {
						ckstr = keyAry.slice(0, i).join(",");
						if (ckstr in this._like_redis_cache) {
							parentObj = this._like_redis_cache[ckstr];
							found = true;
							break;
						}
					}

					if (found) {
						/*	deepCopyしないで親を指す			*/
						/*	親が消える事を考慮すべき？？？	*/
						const shortAry = keyAry.slice(i as number);
						result = this.getObjByKeyAry(parentObj, shortAry, false);	/* NodeepCopy	*/
//						result = this.getObjByKeyAry(parentObj, shortAry, true);	/* deepCopy	*/
DBG.PF(DBG.COL("cache get from parent's object: [%s] <= [%s]", "brightPurple"), keysStr, ckstr);
					}
				}

				if (!found) {
					/*	DBかFileから読むSTUB	*/
					const jObj = await this._readSkillDatJsonObjFromFileAsync();	/* jObjは都度捨てる		*/
//					result = this.getObjByKeyAry(jObj, keyAry);
					result = this.getObjByKeyAry(jObj as TypeJsonValue, keyAry);
				}
			}
		}
		if (!(keysStr in this._like_redis_cache)) {
			this._like_redis_cache[keysStr] = result;
DBG.PF(DBG.COL("cached: %s", "brightPurple"), keysStr);
		}
		return	result;
	}/*	getSkillDatByKeyArray()	*/

//	private getObjByKeyAry(jObj: TypeJsonValue, keyAry: (string | number)[], noDeepCopyFlg = false): TypeJsonObject {
	private getObjByKeyAry(jObj: TypeJsonValue, keyAry: (string | number)[], deepCopyFlg = false): TypeJsonObject {
		let result:TypeJsonValue | null = null;
		let cObj = jObj;
		for (let i = 0; keyAry.length > i && cObj; i++) {
			const cKey: string | number  = keyAry[i];
			if (Number.isInteger(cKey)) {

				if (Array.isArray(cObj) && (cObj as []).length > (cKey as number)) {
					cObj = cObj[cKey as number];
				}
				else {
					cObj = null;
//DBG.PF("%sが見つからない。[%s]", cKey, keyAry.join(", "));
				}
			}
			else {
				if (cKey in (cObj as TypeJsonObject)) {
					cObj = (cObj as TypeJsonObject)[cKey as string];
				}
				else {
//DBG.PF("%sが見つからない。[%s]", cKey, keyAry.join(", "));
					cObj = null;
				}
			}
		}
//		result = ((noDeepCopyFlg)? cObj : UTL.deepCopy(cObj)) as TypeJsonObject;
		result = (deepCopyFlg)? (UTL.deepCopy(cObj) as TypeJsonObject) : cObj;

		return	result as TypeJsonObject;
	}/*	getObjByKeyAry()	*/

	/*	DBかFileから読むSTUB	*/
	private _readSkillDatJsonObjFromFileSync(): TypeSkillHashDat {
		if (this._skillDatCache)	return	this._skillDatCache;

		const fPath = this._skill_dat_filepath;
DBG.PF(DBG.COL("load file Sync: JSON5.Parse: %s", "brightPurple"), fPath);
		const skillData = JSON5.parse(fs.readFileSync(fPath, 'utf8'));

		/*	OnMemoryCache	*/
		if (this._skillDatOnMemoryFlag) {
			this._skillDatCache = skillData;
		}
		else {
			/*	Cacheせずに廃棄	*/
		}

		return	skillData;
	}/*	_readSkillDatJsonObjFromFileSync()	*/
	private async _readSkillDatJsonObjFromFileAsync(): Promise<TypeSkillHashDat> {
		if (this._skillDatCache)	return	this._skillDatCache;

		const fPath = this._skill_dat_filepath;
DBG.PF(DBG.COL("load file Async: JSON5.Parse: %s", "brightPurple"), fPath);
		const skillData = JSON5.parse(await fs.promises.readFile(fPath, 'utf8'));

		/*	OnMemoryCache	*/
		if (this._skillDatOnMemoryFlag) {
			this._skillDatCache = skillData;
		}
		else {
			/*	Cacheせずに廃棄	*/
		}

		return	skillData;
	}/*	_readSkillDatJsonObjFromFileAsync()	*/


	/*	DBかFileから読むSTUB	*/
	private _readSkillDomainTreeDatJsonObjFromFileSync(): TypeJsonObject {
		const fPath = this._skill_domtree_filepath;
DBG.PF(DBG.COL("load file Sync: JSON5.Parse: %s", "brightPurple"), fPath);
		const skillData = JSON5.parse(fs.readFileSync(fPath, 'utf8'));
		return	skillData;
	}/*	_readSkillDomainTreeDatJsonObjFromFileSync()	*/
	private async _readSkillDomainTreeDatJsonObjFromFileAsync(): Promise<TypeJsonObject> {
		const fPath = this._skill_domtree_filepath;
DBG.PF(DBG.COL("load file Async: JSON5.Parse: %s", "brightPurple"), fPath);
		const skillData = JSON5.parse(await fs.promises.readFile(fPath, 'utf8'));
		return	skillData;
	}/*	_readSkillDomainTreeDatJsonObjFromFileAsync()	*/

	/*	DBかFileから読むSTUB	*/
	/*	jObjは都度捨てる		*/
	private _readSkillDatToAllBasicInfsSync(): TypeBasicInfHash {
//		const jObj = this._readSkillDatJsonObjFromFileSync() as { [key: string]: { [key: string]: any } };
		const jObj = this._skillDatCache || this._readSkillDatJsonObjFromFileSync() as { [key: string]: { [key: string]: any } };

		const cObj: { [key: string]: TypeSkillBasicInf } = {};
		for (const key in jObj) {											/* "*"のループ	*/
			if (jObj.hasOwnProperty(key)) {
				const cBinf = jObj[key].basic_inf as TypeSkillBasicInf;
				if (cBinf) {
//					cObj[key]					= UTL.deepCopy(cBinf) as TypeSkillBasicInf;	/* deepCopy		*/
					cObj[key]					= cBinf as TypeSkillBasicInf;				/* shallowCopy	*/
				}
			}
		}

		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		return	cObj;
	}/*	_readSkillDatToAllBasicInfsSync()	*/
	private async _readSkillDatToAllBasicInfsAsync(): Promise<TypeBasicInfHash> {
//		const jObj = await this._readSkillDatJsonObjFromFileAsync() as { [key: string]: { [key: string]: any } };
		const jObj = this._skillDatCache || await this._readSkillDatJsonObjFromFileAsync() as { [key: string]: { [key: string]: any } };

		const cObj: { [key: string]: TypeSkillBasicInf } = {};
		for (const key in jObj) {											/* "*"のループ	*/
			if (jObj.hasOwnProperty(key)) {
				const cBinf = jObj[key].basic_inf as TypeSkillBasicInf;
				if (cBinf) {
//					cObj[key]					= UTL.deepCopy(cBinf) as TypeSkillBasicInf;	/* deepCopy		*/
					cObj[key]					= cBinf as TypeSkillBasicInf;				/* shallowCopy	*/
				}
			}
		}

		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		/*	せっかく読んだのでUSERドメインだけキャッシュしていいかもしれない	*/
		return	cObj;
	}/*	_readSkillDatToAllBasicInfsAsync()	*/


	private checkUnlockConditions(unlockInf: any, user: TypeUser, addDomain: string): boolean {
		/*	unlock_inf の条件をすべてチェックする	*/
		return unlockInf.every((condition: any) => {
			const result = processCommands(condition, [
				{
					/*	has_this_skill	*/
					mustKeys	:	["has_this_skill"],
					process	:	(prm) => {
						// ユーザーがこのスキルを既に持っているかチェック
						const	ret = user.skills.includes(prm.has_this_skill);
if (ret) {
DBG.LOG("\tユーザーが持っている(%s)", ret);
}
else {
DBG.LOG("\tユーザーが持ってない(%s)", ret);
}
						return ret;
					}
				},
				{
					/*	quest_clear_count	*/
					mustKeys	:	["quest_clear_count"],
					process	:	(prm) => {
						// ユーザーのクエストクリア数が条件を満たしているかチェック
						const	ret = user.quest_clear_count == prm.quest_clear_count;
if (ret) {
DBG.PF("\tquest_clear_countが一致(user %d == %d) (%s)", user.quest_clear_count, prm.quest_clear_count, ret);
}
else {
DBG.PF("\tquest_clear_countが不一致(user %d != %d) (%s)", user.quest_clear_count, prm.quest_clear_count, ret);
}
						return ret;
					}
				},
				{
					/*	quest_clear_num_by_domain	*/
					mustKeys	:	["quest_clear_num_by_domain"],
					process	:	(prm) => {
						// ユーザーのクエストクリア数が条件を満たしているかチェック
						const uqClearNum = user?.quest_clear_dom_num?.[addDomain] || 0;
						let ret = false;
						if (">=" == prm.operator) {
							ret = uqClearNum >= prm.quest_clear_num_by_domain;
						}
						else if ("<=" == prm.operator) {
							ret = uqClearNum <= prm.quest_clear_num_by_domain;
						}
						else {
							ret = uqClearNum == prm.quest_clear_num_by_domain;
						}
if (ret) {
DBG.PF("\tquest_clear_num_by_domainが一致(user[%s] %d == %d) (%s)", addDomain, uqClearNum, prm.quest_clear_num_by_domain, ret);
}
else {
DBG.PF("\tquest_clear_num_by_domainが不一致(user[%s] %d != %d) (%s)", addDomain, uqClearNum, prm.quest_clear_num_by_domain, ret);
}
						return ret;
					}
				},
				{
					/*	has_skill	*/
					mustKeys	:	["has_skill"],
					process	:	(prm) => {

						// ユーザーがスキルを持ってるかチェック
						const	tSklId = prm.has_skill;
						const	ret = user.skills.some(skl => tSklId == skl.str_id);
if (ret) {
DBG.PF("\tユーザー保持スキル: %s(%s)", tSklId, ret);
}
else {
DBG.PF("\tユーザー未保持スキル %s(%s)", tSklId, ret);
}
						return ret;
					}
				},
				{
					/*	skill_name", "level_num", "operator"	*/
					mustKeys	:	["skill_name", "level_num", "operator"],
					process	:	(prm) => {
						// ユーザーがスキルを持ってるかチェック
						const	tSklId		= prm.skill_name;
						const	level_num	= prm.level_num;
						const	operator	= prm.operator;
						const	cskl = user.skills.find(skl => tSklId == prm.skill_name);
						const	ret = (cskl && (cskl?.level_num >= level_num));
if (ret) {
DBG.PF("\tスキル %s レベル %d >= %d (%s)", tSklId, cskl?.level_num, level_num, ret);
}
else {
DBG.PF("\tスキル %s レベル %d >= %d (%s)", tSklId, cskl?.level_num, level_num, ret);
}
						return ret;
					}
				},
			], () => {
				/**********************/
				/*	デフォルト処理	*/
				/**********************/
DBG.ERR("未知のcondition");
DBG.VAL(condition, "condition");
				return	false;
			});/*	processCommands()	*/

			return result;
		});
	}/*	checkUnlockConditions()	*/


	private async effectAddByUserSkill(
					levelEffectedAdd: Record<string, unknown>,
					skillDat: TypeUserDatSkill,
					add: number,
					result: any,
					user: TypeUser
			): Promise<Record<string, unknown>> {

		const skillKey = skillDat.str_id;
		const skillExp = skillDat.exp;
		const skillLvl = skillDat.level_num;

		/*	スキルの効果を取得	*/
		const effects = await this.getSkillDatByKeyArray([skillKey, "leveling_inf", "effects"]) as TypeJsonHashAny[];


		if (effects) {
//DBG.VAL(effects, "effects");

			effects.forEach((effect: any) => {
				const result = processCommands(effect, [
					{
						/*	"point_bonus_per", "operator", "level_num"	*/
						mustKeys	:	["point_bonus_per", "operator", "level_num"],
						process	:	(prm) => {
							// ボーナスポイントを計算して追加
							const addPer = prm.point_bonus_per;
							const addOpr = prm.operator;
							const addLvl = prm.level_num;

							let pbp = 0
							if ("*" == addOpr) {
								pbp = addPer * skillLvl * addLvl;
//DBG.PF("  point_bonus_per = %d * level(%d) %s %d = %d(+%0.2f\%)", addPer, skillLvl, addOpr, addLvl, pbp, pbp);
DBG.PF("  point_bonus_per = %0.1f * level(%d) %s %0.1f = %0.1f(+%0.1f\%)", addPer, skillLvl, addOpr, addLvl, pbp, pbp);
							}

							if (!levelEffectedAdd.point_bonus_per) {
								levelEffectedAdd.point_bonus_per = 0;
							}
							const newNum = (levelEffectedAdd.point_bonus_per as number) + pbp;
DBG.PF("  point_bonus_per: %d -> %d", levelEffectedAdd.point_bonus_per, newNum);
							levelEffectedAdd.point_bonus_per = newNum;
							return	true;
						}
					},
				], () => {
					/**********************/
					/*	デフォルト処理	*/
					/**********************/
DBG.ERR("未知のeffects");
DBG.VAL(effects, "effects");
					return	false;
				});/*	processCommands()	*/
			});
		}
		return levelEffectedAdd;
	}/* effectAddByUserSkill() */

	private async userLeveling(
					skillDat: TypeUserDatSkill,
					add: number,
					result: any,
					user: TypeUser
			): Promise<TypeUser> {

		const curKey = skillDat.str_id;
		const curExp = skillDat.exp;
		const curLvl = skillDat.level_num;

		// スキルの効果を取得
		const leveling = await this.getSkillDatByKeyArray([curKey, "leveling_inf", "leveling"]) as TypeJsonHashAny;

		// レベルアップの処理
		if (leveling) {
			let	calcLvl: number = 0;
//			let msg: string = "";

			const pcResult = processCommands(leveling, [
				{
					mustKeys	:	["next_rise_rate", "operator"],
					process		:	(prm) => {
						calcLvl = levelingByNextRiseRate(curExp, prm.next_rise_rate);
						return	true;
					}
				},
				{
					mustKeys	:	["accum_rise_rate"],
					process		:	(prm) => {
						calcLvl = levelingByNextRiseRate(curExp, prm.accum_rise_rate);
						return	true;
					}
				},
			], () => {
				/**********************/
				/*	デフォルト処理	*/
				/**********************/
DBG.ERR("未知のLeveling");
DBG.VAL(leveling, "leveling");
					return	false;
				}
			);/*	processCommands()	*/


//			if (calcLvl > curLvl) {
			if (calcLvl !== curLvl) {
//DBG.PF("\tLVL UP: %d -> %d", curLvl, calcLvl);
				const	upLvl = calcLvl - curLvl;
				/*	レベルＵＰ	*/
				this.plusNumWithKey(skillDat as TypeUserDatSkill, upLvl as number, "level_num");

				if (leveling.msg) {

					const skName = this.getSkillNameByIdFromAllBasicInf(curKey);

					let msgPrms =  this.mkReplaceMsgParams(curKey, leveling, user);
					msgPrms = Object.assign(msgPrms, {
						oldLevel		:	curLvl,
						newLevel		:	calcLvl,
					});
//DBG.VAL(leveling.msg, "Before leveling.msg");
//DBG.VAL(msgPrms, "msgPrms");
//DBG.VAL(user, "user");
					const strMsg = replaceHolders(leveling.msg, msgPrms);
//DBG.VAL(leveling.msg, "After leveling.msg");
					result.push({ msg : strMsg });
				}
			}
			else {
//DBG.PF("\tLVL STAY: %d -> %d", curLvl, calcLvl);
			}

		}

		return user;
	}/* userLeveling() */

	private getSkillNameByIdFromAllBasicInf(sklId: string): string {
		let name = "";
		const abInf = this.allBasicInfs as TypeBasicInfHash;
		if (abInf && (sklId in abInf)) {
			name = abInf[sklId].dispname_jp;
		}
		else {
DBG.ERR("未知のスキル: "+sklId);
		}

//		name = name || "";
		return	name;
	}/*	getSkillNameByIdFromAllBasicInf()	*/

	private checkLevelUpConditions(levelingInf: any, user: TypeUser): boolean {
		// leveling_inf の条件をすべてチェックする
		const requiredExp = levelingInf["levelup_requirement"].level_num * 100;
		return user.exp >= requiredExp;
	} // checkLevelUpConditions

	private setUnlockUserResult(
				skillKey: string,
				user: any, 
				result: any, 
				unlockResult: any
			): any {

		let msgPrms: Record<string, any> = {};

		// unlockResultに基づいてユーザーデータを更新
		unlockResult.forEach((res: any) => {


			msgPrms =  this.mkReplaceMsgParams(skillKey, res, user, msgPrms);

			let	unlSid: string | null = null;
			let	intSid: string | null = null;

			if (res.unlock_skill) {
				/*	replaceHolders()はMSGだけにする	*/
//				unlSid = replaceHolders(res.unlock_skill, msgPrms);
				unlSid = res.unlock_skill;
				msgPrms.unlockName  = this.getSkillNameByIdFromAllBasicInf(unlSid as string);
			}
			if (res.integrate_skill) {
				/*	replaceHolders()はMSGだけにする	*/
//				intSid = replaceHolders(res.integrate_skill, msgPrms);
				intSid = res.integrate_skill;
				msgPrms.integrateName  = this.getSkillNameByIdFromAllBasicInf(intSid as string);
			}

			if (unlSid) {

				// スキルをユーザーに追加
				user.skills.push({
					"str_id"	:	unlSid,
					"level_num"	:	1,
					"exp"		:	0
				});
//DBG.PF("スキル: %s を獲得", res.unlock_skill);
DBG.PF("スキル: %s を獲得", unlSid);


				const rObj = UTL.deepCopy(res);
				if ("msg" in rObj) {
					rObj.msg = replaceHolders(rObj.msg, msgPrms);
				}
				result.push(rObj);
			}

			if (intSid) {
				// スキルの統合処理
				user.skills = user.skills.filter((skill: any) => skill.str_id !== intSid);
DBG.PF("スキル: %s を統合・削除", res.integrate_skill);
				const rObj = UTL.deepCopy(res);
				if ("msg" in rObj) {
					rObj.msg = replaceHolders(rObj.msg, msgPrms);
				}
				result.push(rObj);
			}

//	SNAP	honor
			if (res.unlock_honor) {
				// 称号をユーザーに追加
				if (!user.honors) {
					user.honors = [];
				}
				user.honors.push({ str_id : res.unlock_honor });
DBG.PF("称号: %s を獲得", res.unlock_skill);
				result.push(res);
			}


			// 必要に応じて他の結果処理をここに追加
			// 例: 経験値やステータスの更新など
		});

		return user;
	}/* setUnlockUserResult() */


	private async effectAddUser(
				user: TypeUser, 
				lvlEfctAdd: Record<string, unknown>, 
				result: any,
			): Promise<TypeUser> {

DBG.PF("スキル効果UseDat反映");
//DBG.VAL(user, "user");
//DBG.VAL(lvlEfctAdd, "lvlEfctAdd");

		let	addedUser = UTL.deepCopy(user);

		let	expAddSkillIdsAry: string[] = [];

		/*	ユーザー保持スキル	*/
		const userHasSkillNames = addedUser.skills.map(skl => skl.str_id);
//DBG.VAL(userHasSkillNames, "userHasSkillNames");

		/*	Questと同じDomainの親スキルにも反映	*/
		let parentDoms: string[] | null = null;
		const	addDomain = lvlEfctAdd.domain as string;
		if (addDomain) {

			if (!this.domainParentDomains) {
	            // 親ドメインマップを構築
//				this.domainParentDomains = this.loadBuildParentDomainMapSync(); 
				this.domainParentDomains = await this.loadBuildParentDomainMapAsync(); 
			}

			const addDomParentsAry	= this.domainParentDomains[addDomain];
			if (!addDomParentsAry) {
DBG.ERR("ドメイン: "+addDomain+" の親ドメインが domainParentDomains にない。");
			}
//DBG.VAL(addDomParentsAry, "addDomParentsAry");

			const allBInfs = this.allBasicInfs as TypeBasicInfHash;
			for (let i = 0; userHasSkillNames.length > i; i++) {

				const uSkillName = userHasSkillNames[i];
//DBG.VAL(uSkillName, "uSkillName");

				const uSkillDom = allBInfs[uSkillName].domain;
//DBG.VAL(uSkillDom, "uSkillDom");
				if (!uSkillDom) {
DBG.VAL(allBInfs, "allBInfs");
				}
				if (addDomParentsAry.find(parentDom => (uSkillDom == parentDom))) {
					/*	addDomainの親Domainと、同じdomainがあるスキルは加算	*/
					const	userSkillDomainSameAddDomain = userHasSkillNames[i];
DBG.PF("  addDomain<%s>の親ドメイン<%s>である、スキル「%s」にも経験値加算", addDomain, uSkillDom, userSkillDomainSameAddDomain);
					expAddSkillIdsAry.push(userSkillDomainSameAddDomain);
				}
			}
			expAddSkillIdsAry = [...new Set(expAddSkillIdsAry)];	/* uniqueに	*/
//DBG.VAL(expAddSkillIdsAry, "expAddSkillIdsAry");
		}



		/* lvlEfctAddに格納されているスキルの効果をユーザーに反映	*/
		Object.keys(lvlEfctAdd).forEach(addKey => {
DBG.PF("%s: +add", addKey);
			const addVal = lvlEfctAdd[addKey];

			if ("domain" == addKey) {
				/*	scoreで処理	*/
			}
			else if ("point_bonus_per" == addKey) {
				/*	scoreで処理	*/
			}
			else if ("score" == addKey) {
				let bonusPer = 0;
				if (lvlEfctAdd.point_bonus_per) {
					bonusPer = lvlEfctAdd.point_bonus_per as number;
				}

				/************************************************************/
				/*	scoreから加算ポイントを計算して、同ドメインのExpに追加	*/
				/************************************************************/
				/*	scoreはそのまま加算	*/
//				this.plusNumWithKey(addedUser, addVal as number, addKey as keyof TypeUser);
				this.plusNumWithKey(addedUser, addVal as number, "total_score");

				/*	pointはbonus付きで	*/
				this.plusNumWithKey(addedUser, addVal as number, "point", bonusPer);

				/*	経験値はそのまま加算	*/
//				Object.keys(skillsInAddDomAllAndUserDom).forEach(sklId => {
DBG.VAL(expAddSkillIdsAry, "expAddSkillIdsAry");
				expAddSkillIdsAry.forEach(sklId => {
					const sklHash = addedUser.skills.find(skl => sklId == skl.str_id);
//DBG.VAL(sklId, "sklId");
//DBG.VAL(sklHash, "sklHash");
					if (sklHash) {
DBG.PF("%s: +exp", sklId);
						this.plusNumWithKey(sklHash as TypeUserDatSkill, addVal as number, "exp");
					}
					else {
DBG.PF("  未取得スキル %s ", sklId);
					}
				});
			}
			else if ("quest_clear_count" == addKey) {
				this.plusNumWithKey(addedUser as TypeUser, addVal as number, addKey as keyof TypeUser);

				/*	ドメイン毎もカウントUPしてやる	*/
				const cDom = lvlEfctAdd.domain || "USER";

				addedUser.quest_clear_dom_num = addedUser.quest_clear_dom_num || {};
				this.plusNumWithKey(addedUser.quest_clear_dom_num as TypeQuestClearNum, addVal as number, cDom as keyof TypeQuestClearNum);



			}
//			else if (Number.isInteger(addVal)) {
			else if (UTL.isNumber(addVal)) {
				this.plusNumWithKey(addedUser as TypeUser, addVal as number, addKey as keyof TypeUser);
			}
			else {
DBG.ERR("未知のadd: "+addKey);
			}
		});

		return addedUser;
	}/* effectAddUser() */

	private plusNumWithKey<T>(
				auser: T,
				addVal: number, 
				srcKey: keyof T,
//				srcKey: NumberKeys<T>,
				bonusPer: number = 0, 
			): void {

		const	dstVal = (auser[srcKey] as number) || 0;
		let		newVal = dstVal + addVal;

		if (0 < bonusPer) {
			const bonusVal = addVal * bonusPer / 100;
			newVal += bonusVal;

			/*	計算結果は一応整数(小数以下切捨)	*/
			newVal = Math.floor(newVal);
//DBG.PF("  %-18s:\t%d\t(+%d)\t+%d(%d\%)\t=\t%d", srcKey, dstVal, addVal, bonusVal, bonusPer, newVal);
DBG.PF("  %-18s:\t%d\t(+%d)\t+%0.1f(%0.1f\%)\t=\t%d", srcKey, dstVal, addVal, bonusVal, bonusPer, newVal);
		}
		else {
//DBG.PF("  %-18s:\t%d\t(+%d)\t\t=\t%d", srcKey, dstVal, addVal, newVal);
DBG.PF("  %-18s:\t%d\t(+%d)\t\t\t=\t%d", srcKey, dstVal, addVal, newVal);
		}
		auser[srcKey] = newVal as T[keyof T];
	}/*	plusNumWithKey()	*/

	private mkReplaceMsgParams(
						skillId: string, 
						thisBlock: TypeJsonObject,
//	SNAP	危ない？
						user: TypeUser,
						msgParams: Record<string, any> = {},
				): Record<string, any> {

		msgParams._THIS	= thisBlock;
		msgParams.user	= user;

		/*	basic_infの値もassignされる	*/
//		"str_id"		:	"userSkill",	/* 文字列ID */
//		"dispname_jp"	:	"レベル",		/* スキル名 */
//		"domain"		:	"USER"			/* ドメイン */
		msgParams = Object.assign(msgParams, (this.allBasicInfs as TypeBasicInfHash)[skillId]);

		return	msgParams;
	}/*	mkReplaceMsgParams()	*/



	/*	class終端	*/

}/*	class SkillManager	*/



function filterHash<T>(
				hash: 			{ [key: string]: T }, 
				predicate:	(value: T, key: string) => boolean
		): { [key: string]: T } {

	return Object.keys(hash).reduce(
		/*	reduce():	callback()													*/
		/*	callback: 各要素に対して実行する関数です。4つの引数を取ります:		*/
		/*		accumulator: 前回の関数の結果（初回はinitialValue）。				*/
		/*		currentValue: 現在の配列の要素。									*/
		/*		currentIndex: 現在のインデックス（省略可能）。					*/
		/*		array: 操作している配列（省略可能）。								*/
		(result: { [key: string]: T }, key: string) => {
			if (predicate(hash[key], key)) {
				result[key] = hash[key];
			}
			return result;
		}, 
		/* reduce():	initialValue													*/
		/*	initialValue: 最初のaccumulatorに渡される初期値（省略可能）。		*/
		{}
	);
}/* filterHash() */



//const result = processCommands(condition, [
//	{
//		mustKeys	:	["key0", "key1"],
//		process		:	(prm) => {
//			//	prm.key0, prm.key1
//			return	true;
//		}
//	},
//], () => {
//	//	デフォルト処理
//	return	false;
//});/*	processCommands()	*/
function processCommands<T extends object, R>(
			obj:		T,
			commands:	Array<{
								mustKeys: (keyof T)[],
								process: (values: Partial<T>) => R
						}>,
			defaultHandler?: () => R
//	): R | null {
	): R | undefined {

	for (const { mustKeys, process } of commands) {
		let allKeysExist = true;
		const values: Partial<T> = {};

		for (const key of mustKeys) {
			if (key in obj) {
				values[key] = obj[key];
			} else {
				allKeysExist = false;
				break;
			}
		}

		if (allKeysExist) {
			return process(values);
		}
	}

	return defaultHandler ? defaultHandler() : undefined;
//	return defaultHandler ? defaultHandler() : null;
}/*	processCommands()	*/

/********************************************/
/*	レベル計算法								*/
/*		nextRiseRate = 100の時				*/
/*	Level 1:	exp = 100						*/
/*	Level 2:	exp = 300						*/
/*	Level 3:	exp = 600						*/
/*	Level 4:	exp = 1000					*/
/*	Level 5:	exp = 1500					*/
/*	Level 6:	exp = 2100					*/
/*	Level 7:	exp = 2800					*/
/*	Level 8:	exp = 3600					*/
/*	Level 9:	exp = 4500					*/
/*	Level 10:	exp = 5500					*/
/*	Level 11:	exp = 6600					*/
/*	Level 12:	exp = 7800					*/
/*	Level 13:	exp = 9100					*/
/*	Level 14:	exp = 10500					*/
/*	Level 15:	exp = 12000					*/
/*		=Level*(Level+1)/2*nextRiseRate		*/
/********************************************/
function levelingByNextRiseRate(curExp: number, nextRiseRate: number): number {
	let	nextLevel = 0;
	let	nextExp = 0;
	while (true) {
		nextLevel++;
		//	100		0	+ 1		100	
		//	300		100	+ 2		100	
		nextExp = nextExp + nextLevel * nextRiseRate;
		if (curExp < nextExp) {
			break;
		}
//DBG.INF("Level "+nextLevel+": exp = "+nextExp);
	}
	return	nextLevel;
}/*	levelingByNextRiseRate()	*/



/**
 * プレースホルダを動的に置き換える関数
 * 
 * @param template {string} - テンプレート文字列
 * @param aliasMap {Record<string, any>} - エイリアスを格納するマップ
 * @param visited {Set<string>} - 既に訪れたプレースホルダを追跡するセット
 * @returns {string} - 置き換え後の文字列
 */
function replaceHolders(
				template: string, 
				aliasMap: Record<string, any>, 
				visited: Set<string> = new Set()
			): string {

	return template.replace(/\$\{([^\}]+)\}/g, (match, path) => {
		// 無限ループを防ぐために、既に訪れたパスを追跡
		if (visited.has(path)) {
DBG.ERR(`無限ループ in path: ${path}`); /* 無限ループ検出 */
DBG.VAL(template, "template")
DBG.VAL(aliasMap, "aliasMap")
			return	template;
		}

		// 再帰的に内部のプレースホルダを展開
		visited.add(path); /* 訪問済みとしてセットに追加 */
		path = replaceHolders(path, aliasMap, visited); /* 再帰的呼び出し */
		visited.delete(path); /* 再帰終了後にセットから削除 */

		// "bi.dispname_jp" のような形式でエイリアスとプロパティ名を分解
		const [alias, ...properties] = path.split('.'); /* エイリアスとプロパティの分解 */

		// エイリアス（aliasMap）を使ってローカル変数を取得
		let value = aliasMap[alias]; /* エイリアスを取得 */

		if (!value) {
			return match; /* エイリアスが見つからなければそのまま */
		}

		// プロパティを順に辿っていく
		for (let property of properties) {
			value = value[property]; /* プロパティを順に参照 */
			if (value === undefined) {
				return match; /* プロパティが存在しなければそのまま */
			}
		}

		return value; /* プロパティの最終的な値を返す */
	});
} /*	replaceHolders()	*/


