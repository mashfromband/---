// -*- coding: utf-8 -*-

import path from "path";

import Config from "config";
import { Logger } from "pino";

import { SkillManager } from "../external/skill/skill_manager";

export class CommonSkillHandler {
    constructor() {}

    private static ins: SkillManager;
    private static _isInitialized: boolean = false;

    public static init(logger: Logger) {
        const useCache = Config.get("skill.useFileCache") as boolean;
        const dataFilePath = path.join(process.cwd(), Config.get("skill.filePath.dataFile"));
        const domainTreeFilePath = path.join(process.cwd(), Config.get("skill.filePath.domainTreeFile"));

        logger.info(
            {
                useCache: useCache,
                dataFilePath: dataFilePath,
                domainTreeFilePath: domainTreeFilePath,
            },
            "SkillManager を初期化します",
        );

        this.ins = SkillManager.getInstance(
            Config.get("skill.useFileCache") as boolean,
            Config.get("skill.filePath.dataFile") as string,
            Config.get("skill.filePath.domainTreeFile") as string,
        );

        if (this.ins) {
            logger.info(
                {
                    useCache: useCache,
                    dataFilePath: dataFilePath,
                    domainTreeFilePath: domainTreeFilePath,
                },
                "SkillManager を初期化成功しました",
            );
            this._isInitialized = true;
        }
    }

    public static get() {
        if (this._isInitialized) {
            return this.ins;
        }
        else {
            throw(new Error("SkillManager is not initialized."));
        }
    }

    public static get isInitialized() {
        return this._isInitialized;
    }
}
