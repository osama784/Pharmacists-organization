import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import Bank from "../../models/bank.model.js";
import { BankResponseDto, toBankResponseDto } from "../../types/dtos/bank.dto.js";

const getBank = async (req: Request, res: TypedResponse<BankResponseDto>, next: NextFunction) => {
    try {
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: toBankResponseDto(bank) });
    } catch (e) {
        next(e);
    }
};

export default getBank;
