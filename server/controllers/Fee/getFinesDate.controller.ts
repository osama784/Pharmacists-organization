import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getFinesDate = async (req: Request, res: TypedResponse<{ "fines-date": string }>, next: NextFunction) => {
    res.json({ success: true, data: { "fines-date": staticData["fines-date"] } });
};

export default getFinesDate;
