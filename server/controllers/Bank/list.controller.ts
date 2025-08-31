import { NextFunction, Request, TypedResponse } from "express";
import { BankResponseDto, toBankResponseDto } from "../../types/dtos/bank.dto";
import Bank from "../../models/bank.model";
import IBankQuery from "../../types/queries/bank.query";
import buildBankFilters from "./utils/buildBankFilters";

const listBanks = async (req: Request, res: TypedResponse<BankResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as IBankQuery;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = buildBankFilters(queries);
        const banks = await Bank.find(filters).skip(skip).limit(limit);
        res.json({
            success: true,
            data: toBankResponseDto(banks),
            meta: {
                totalItems: banks.length,
                currentPage: page,
                totalPages: Math.ceil(banks.length / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default listBanks;
