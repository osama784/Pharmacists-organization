import fs from "fs/promises";
import path from "path";
import staticData from "../../config/static-data.json";

import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";

const updatePresidentName = async (req: Request, res: TypedResponse<{ president: string }>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: [responseMessages.BAD_REQUEST] });
        return;
    }
    const president = req.body["president"];

    if (!president || typeof president != "string") {
        res.status(400).json({ success: false, details: [responseMessages.INVALID_STRING_VALUE] });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        staticData["president"] = president;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: { president: staticData["president"] } });
    } catch (e) {
        next(e);
    }
};

export default updatePresidentName;
