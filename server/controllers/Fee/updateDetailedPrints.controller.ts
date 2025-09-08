import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";
import { IDetailedPrints } from "../../types/models/fee.types";
import path from "path";
import fs from "fs/promises";

const updateDetailedPrints = async (req: Request, res: TypedResponse<Record<string, number>>, next: NextFunction) => {
    const validatedData: IDetailedPrints = req.validatedData;
    staticData["prints"] = validatedData;
    try {
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        await fs.writeFile(DATA_PATH, JSON.stringify(staticData, null, 2), "utf8");
        let result: Record<string, number> = {};
        Object.entries(validatedData).map((entry) => {
            result[entry[0]] = parseInt(entry[1]);
        });
        res.json({ success: true, data: result });
    } catch (e) {
        next(e);
    }
};

export default updateDetailedPrints;
