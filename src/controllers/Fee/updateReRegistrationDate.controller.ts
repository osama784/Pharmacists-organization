import fs from "fs/promises";
import path from "path";
import staticData from "../../config/static-data.json";

import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";

const updateReRegistrationDate = async (req: Request, res: TypedResponse<string>, next: NextFunction) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const ReRegistrationDate = req.body["re-registration-date"];

    if (!ReRegistrationDate || typeof ReRegistrationDate == "number" || isNaN(Date.parse(ReRegistrationDate))) {
        res.status(400).json({ success: false, details: [responseMessages.INVALID_DATE_VALUE] });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        staticData["re-registration-date"] = ReRegistrationDate;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: staticData["re-registration-date"] });
    } catch (e) {
        next(e);
    }
};

export default updateReRegistrationDate;
