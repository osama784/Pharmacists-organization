import { NextFunction, Request, TypedResponse } from "express";
import { CreateBankDto, BankResponseDto, toBankResponseDto } from "../../types/dtos/bank.dto";
import Bank from "../../models/bank.model";

const createBank = async (req: Request, res: TypedResponse<BankResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateBankDto = req.validatedData;
        const bank = await Bank.create(validatedData);

        res.json({ success: true, data: toBankResponseDto(bank) });
    } catch (e) {
        next(e);
    }
};

export default createBank;
