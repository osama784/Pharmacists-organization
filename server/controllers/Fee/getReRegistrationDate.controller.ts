import { NextFunction, Request, TypedResponse } from "express";
import staticData from "../../config/static-data.json";

const getReRegistrationDate = (req: Request, res: TypedResponse<{ reregistrationDate: string }>, next: NextFunction) => {
    res.json({ success: true, data: { reregistrationDate: staticData["reregistrationDate"] } });
};

export default getReRegistrationDate;
