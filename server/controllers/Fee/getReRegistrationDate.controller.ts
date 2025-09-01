import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getReRegistrationDate = (req: Request, res: TypedResponse<{ "re-registration-date": string }>, next: NextFunction) => {
    res.json({ success: true, data: { "re-registration-date": staticData["re-registration-date"] } });
};

export default getReRegistrationDate;
