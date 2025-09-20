import { z } from "zod";
import { RECEIPT_BOOKS } from "../../models/treasuryFee.model";
import {
    PopulatedTreasuryReceiptDocument as PopulatedTreasuryReceiptDocument,
    TreasuryReceiptDocument as TreasuryReceiptDocument,
} from "../models/treasuryReceipt.types";
import { PharmacistResponseDto, toPharmacistResponseDto } from "./pharmacist.dto";
import { TreasuryReceiptCreateSchema, TreasuryReceiptUpdateSchema } from "../../validators/treasuryReceipt.schema";

export type TreasuryReceiptCreateDto = z.infer<typeof TreasuryReceiptCreateSchema>;
export type TreasuryReceiptUpdateDto = z.infer<typeof TreasuryReceiptUpdateSchema>;

export type TreasuryReceiptResponseDto = {
    id: string;
    receiptBook: RECEIPT_BOOKS;
    pharmacist: PharmacistResponseDto | string;
    fees: { name: string; value: number }[];
    total: number;
    createdAt: Date;
};

export function toTreasuryReceiptResponseDto(
    data: TreasuryReceiptDocument[] | PopulatedTreasuryReceiptDocument[]
): TreasuryReceiptResponseDto[];
export function toTreasuryReceiptResponseDto(data: TreasuryReceiptDocument | PopulatedTreasuryReceiptDocument): TreasuryReceiptResponseDto;
export function toTreasuryReceiptResponseDto(
    data: TreasuryReceiptDocument | PopulatedTreasuryReceiptDocument | TreasuryReceiptDocument[] | PopulatedTreasuryReceiptDocument[]
): TreasuryReceiptResponseDto | TreasuryReceiptResponseDto[] {
    if (Array.isArray(data)) {
        let result: TreasuryReceiptResponseDto[] = [];
        data.forEach((doc) => {
            result.push(_toTreasuryReceiptResponseDto(doc));
        });
        return result;
    }
    return _toTreasuryReceiptResponseDto(data);
}

function _toTreasuryReceiptResponseDto(doc: TreasuryReceiptDocument | PopulatedTreasuryReceiptDocument): TreasuryReceiptResponseDto {
    if ("__v" in doc.pharmacist) {
        return {
            id: doc.serialID,
            receiptBook: doc.receiptBook,
            pharmacist: toPharmacistResponseDto(doc.pharmacist),
            fees: doc.fees,
            total: doc.total,
            createdAt: doc.createdAt,
        };
    }
    return {
        id: doc.serialID,
        receiptBook: doc.receiptBook,
        pharmacist: doc.pharmacist.toString(),
        fees: doc.fees,
        total: doc.total,
        createdAt: doc.createdAt,
    };
}
