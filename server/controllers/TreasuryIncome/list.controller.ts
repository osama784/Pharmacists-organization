import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeResponseDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { ITreasuryIncomeQuery } from "../../types/queries/treasuryIncome.query";
import buildTreasuryIncomeFilters from "./utils/buildTreasuryIncomeFilters";
import { TREASURY_SECTIONS } from "../../models/treasuryFee.model";

const listTreasuryIncomes = async (req: Request, res: TypedResponse<Record<string, TreasuryIncomeResponseDto[]>>, next: NextFunction) => {
    try {
        const queries: ITreasuryIncomeQuery = req.query;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = buildTreasuryIncomeFilters(queries);

        const fees = await TreasuryIncome.find(filters).sort("-updatedAt").skip(skip).limit(limit);
        let result: Record<string, TreasuryIncomeResponseDto[]> = {};
        for (const section of Object.values(TREASURY_SECTIONS)) {
            let currentFees = fees.filter((fee) => fee.associatedSection == section);
            result[section] = toTreasuryIncomeResponseDto(currentFees);
        }

        const totalItems = await TreasuryIncome.countDocuments(filters);

        res.json({
            success: true,
            data: result,
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

export default listTreasuryIncomes;
