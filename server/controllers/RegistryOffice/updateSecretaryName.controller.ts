import fs from "fs/promises";
import path from "path";
import staticData from "../../config/static-data.json";

import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";

const updateSecretaryName = async (req: Request, res: TypedResponse<{ secretary: string }>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: [responseMessages.BAD_REQUEST] });
        return;
    }
    const secretary = req.body["secretary"];

    if (!secretary || typeof secretary != "string") {
        res.status(400).json({ success: false, details: [responseMessages.INVALID_STRING_VALUE] });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        staticData["secretary"] = secretary;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: { secretary: staticData["secretary"] } });
    } catch (e) {
        next(e);
    }
};

export default updateSecretaryName;
