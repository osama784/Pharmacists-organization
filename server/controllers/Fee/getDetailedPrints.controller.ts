import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";
import { IDetailedPrints } from "../../types/models/fee.types";

const getDetailedPrints = (req: Request, res: TypedResponse<Record<string, number>>, next: NextFunction) => {
    let result: Record<string, number> = {};
    Object.entries(staticData["prints"]).map((entry) => {
        result[entry[0]] = parseInt(entry[1] as unknown as string);
    });
    res.json({ success: true, data: result });
};

export default getDetailedPrints;
