import { NextFunction, Request, TypedResponse } from "express";
import ITreasuryFeeQuery from "../../types/queries/treasuryFee.query";
import buildTreasuryFeeFilters from "./utils/buildTreasuryFeeFilters";
import TreasuryFee from "../../models/treasuryFee.model";
import { ReceiptBooksEnum } from "../../types/models/treasuryFee.types";
import { SectionsEnum } from "../../models/section.model";
import { SectionDocument } from "../../types/models/section.types";
import { toTreasuryFeeResponseDto, TreasuryFeeResponseDto } from "../../types/dtos/treasuryFee.dto";

const listTreasuryFees = async (
    req: Request,
    res: TypedResponse<Record<string, Record<string, TreasuryFeeResponseDto[]>>>,
    next: NextFunction
) => {
    try {
        const queries = req.query as ITreasuryFeeQuery;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = await buildTreasuryFeeFilters(queries);
        const fees = await TreasuryFee.find(filters)
            .skip(skip)
            .limit(limit)
            .populate<{ associatedSection: SectionDocument }>("associatedSection");
        let result: Record<string, Record<string, TreasuryFeeResponseDto[]>> = {};

        Object.values(ReceiptBooksEnum).forEach((receiptBook) => {
            let currentFees = fees.filter((fee) => fee.receiptBook == receiptBook);
            result[receiptBook] = {};
            for (const section of Object.values(SectionsEnum)) {
                let finalFees = currentFees.filter((fee) => fee.associatedSection.name == section);
                result[receiptBook][section] = finalFees.map((fee) => toTreasuryFeeResponseDto(fee));
            }
        });
        const totalItems = await TreasuryFee.find(filters).countDocuments();
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

export default listTreasuryFees;
