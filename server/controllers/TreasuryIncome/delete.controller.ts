import { NextFunction, Request, TypedResponse } from "express";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { responseMessages } from "../../translation/response.ar";

const deleteTreasuryIncome = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const fee = await TreasuryIncome.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await fee.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteTreasuryIncome;
