import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getFinesDate = async (req: Request, res: TypedResponse<string>, next: NextFunction) => {
    res.json({ success: true, data: staticData["fines-date"] });
};

export default getFinesDate;
