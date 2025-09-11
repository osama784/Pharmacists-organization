import { NextFunction, Request, TypedResponse } from "express";
import staticData from "./../../config/static-data.json";

const getPresidentName = (req: Request, res: TypedResponse<{ president: string }>, next: NextFunction) => {
    res.json({ success: true, data: { president: staticData["president"] } });
};

export default getPresidentName;
