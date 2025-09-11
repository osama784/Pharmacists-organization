import { NextFunction, Request, TypedResponse } from "express";
import staticData from "./../../config/static-data.json";

const getSecretaryName = (req: Request, res: TypedResponse<{ secretary: string }>, next: NextFunction) => {
    res.json({ success: true, data: { secretary: staticData["secretary"] } });
};

export default getSecretaryName;
