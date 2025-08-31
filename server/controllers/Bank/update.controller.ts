import { NextFunction, Request, TypedResponse } from "express";
import { UpdateBankDto, BankResponseDto, toBankResponseDto } from "../../types/dtos/bank.dto";
import Bank from "../../models/bank.model";
import { responseMessages } from "../../translation/response.ar";

const updateBank = async (req: Request, res: TypedResponse<BankResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdateBankDto = req.validatedData;
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        await bank.updateOne({ $set: validatedData });

        const doc = await Bank.findById(bank.id);

        res.json({ success: true, data: toBankResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateBank;
