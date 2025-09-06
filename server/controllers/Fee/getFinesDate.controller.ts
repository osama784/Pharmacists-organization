import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getFinesDate = async (req: Request, res: TypedResponse<{ finesDate: string }>, next: NextFunction) => {
    res.json({ success: true, data: { finesDate: staticData["finesDate"] } });
};

export default getFinesDate;
