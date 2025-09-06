import fs from "fs/promises";
import path from "path";
import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";
import { responseMessages } from "../../translation/response.ar";

const updateFinesDate = async (req: Request, res: TypedResponse<{ finesDate: string }>, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({ success: false, details: [responseMessages.BAD_REQUEST] });
        return;
    }
    const finesDate = req.body["finesDate"];

    if (!finesDate || typeof finesDate == "number" || isNaN(Date.parse(finesDate))) {
        res.status(400).json({ success: false, details: [responseMessages.INVALID_DATE_VALUE] });
        return;
    }

    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        staticData["finesDate"] = finesDate;
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        res.json({ success: true, data: { finesDate: staticData["finesDate"] } });
    } catch (e) {
        next(e);
    }
};

export default updateFinesDate;
