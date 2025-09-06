import fs from "fs/promises";
import path from "path";
import staticData from "../../config/static-data.json";

import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";

const updateReRegistrationDate = async (req: Request, res: TypedResponse<{ reregistrationDate: string }>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: [responseMessages.BAD_REQUEST] });
        return;
    }
    const ReRegistrationDate = req.body["reregistrationDate"];

    if (!ReRegistrationDate || typeof ReRegistrationDate == "number" || isNaN(Date.parse(ReRegistrationDate))) {
        res.status(400).json({ success: false, details: [responseMessages.INVALID_DATE_VALUE] });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        staticData["reregistrationDate"] = ReRegistrationDate;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: { reregistrationDate: staticData["reregistrationDate"] } });
    } catch (e) {
        next(e);
    }
};

export default updateReRegistrationDate;
