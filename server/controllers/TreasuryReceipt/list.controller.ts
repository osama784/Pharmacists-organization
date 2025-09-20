import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryReceiptResponseDto, TreasuryReceiptResponseDto } from "../../types/dtos/treasuryReceipt.dto";
import TreasuryReceipt from "../../models/treasuryReceipt.model";
import { ITreasuryReceiptQuery } from "../../types/queries/treasuryReceipt.query";
import buildTreasuryReceiptFilters from "./utils/buildTreasuryReceiptFilters";
import { RECEIPT_BOOKS } from "../../models/treasuryFee.model";

const listTreasuryReceipts = async (req: Request, res: TypedResponse<Record<string, TreasuryReceiptResponseDto[]>>, next: NextFunction) => {
    try {
        const queries: ITreasuryReceiptQuery = req.query;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = await buildTreasuryReceiptFilters(queries);

        const receipts = await TreasuryReceipt.find(filters).sort("-updatedAt").skip(skip).limit(limit);

        let result: Record<string, TreasuryReceiptResponseDto[]> = {};

        Object.values(RECEIPT_BOOKS).forEach((receiptBook) => {
            const currentReceipts = receipts.filter((obj) => obj.receiptBook == receiptBook);
            result[receiptBook] = toTreasuryReceiptResponseDto(currentReceipts);
        });

        const totalItems = await TreasuryReceipt.countDocuments(filters);

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

export default listTreasuryReceipts;
