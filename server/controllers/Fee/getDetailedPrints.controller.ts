import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";
import { IDetailedPrints } from "../../types/models/fee.types";

const getDetailedPrints = (req: Request, res: TypedResponse<IDetailedPrints>, next: NextFunction) => {
    res.json({ success: true, data: staticData["prints"] });
};

export default getDetailedPrints;
