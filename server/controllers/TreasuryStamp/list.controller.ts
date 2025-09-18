import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryStampResponseDto, TreasuryStampResponseDto } from "../../types/dtos/treasuryStamp.dto";
import TreasuryStamp from "../../models/treasuryStamp.model";
import { ITreasuryStampQuery } from "../../types/queries/treasuryStamp.query";
import buildTreasuryStampFilters from "./utils/buildTreasuryStampFilters";

const listTreasuryStamps = async (req: Request, res: TypedResponse<TreasuryStampResponseDto[]>, next: NextFunction) => {
    try {
        const queries: ITreasuryStampQuery = req.query;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = buildTreasuryStampFilters(queries);

        const fees = await TreasuryStamp.find(filters).skip(skip).limit(limit);

        const totalItems = await TreasuryStamp.countDocuments(filters);

        res.json({
            success: true,
            data: toTreasuryStampResponseDto(fees),
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

export default listTreasuryStamps;
