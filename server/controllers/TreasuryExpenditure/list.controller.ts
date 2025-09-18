import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryExpenditureResponseDto, TreasuryExpenditureResponseDto } from "../../types/dtos/treasuryExpenditure.dto";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { ITreasuryExpenditureQuery } from "../../types/queries/treasuryExpenditure.query";
import buildTreasuryExpenditureFilters from "./utils/buildTreasuryExpenditureFilters";
import { TREASURY_SECTIONS } from "../../models/treasuryFee.model";

const listTreasuryExpenditures = async (
    req: Request,
    res: TypedResponse<Record<string, TreasuryExpenditureResponseDto[]>>,
    next: NextFunction
) => {
    try {
        const queries: ITreasuryExpenditureQuery = req.query;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = buildTreasuryExpenditureFilters(queries);

        const fees = await TreasuryExpenditure.find(filters).skip(skip).limit(limit);
        let result: Record<string, TreasuryExpenditureResponseDto[]> = {};
        for (const section of Object.values(TREASURY_SECTIONS)) {
            let currentFees = fees.filter((fee) => fee.associatedSection == section);
            result[section] = toTreasuryExpenditureResponseDto(currentFees);
        }

        const totalItems = await TreasuryExpenditure.countDocuments(filters);

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

export default listTreasuryExpenditures;
