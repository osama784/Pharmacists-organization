import { NextFunction, Request, TypedResponse } from "express";
import PracticeType from "../../models/practiceType.model.js";

const listPracticeTypes = async (req: Request, res: TypedResponse<any>, next: NextFunction) => {
    try {
        const data = await PracticeType.find().select("-fees");
        res.json({ success: true, data: data });
    } catch (e) {
        next(e);
    }
};

export default listPracticeTypes;
