import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getReRegistrationDate = (req: Request, res: TypedResponse<string>, next: NextFunction) => {
    res.json({ success: true, data: staticData["re-registration-date"] });
};

export default getReRegistrationDate;
