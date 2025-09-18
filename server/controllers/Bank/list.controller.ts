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
        const banks = await Bank.find(filters).sort("-updatedAt").skip(skip).limit(limit);

        const totalItems = await Bank.countDocuments(filters);
        res.json({
            success: true,
            data: toBankResponseDto(banks),
            meta: {
                totalItems: totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default listBanks;
