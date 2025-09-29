import { z } from "zod";
import { TreasuryExpenditureDocument } from "../models/treasuryExpenditure.types";
import { createTreasuryExpenditureZodSchema, updateTreasuryExpenditureZodSchema } from "../../validators/treasuryExpenditure.schema";
import { dateUtils } from "../../utils/dateUtils";

export type TreasuryExpenditureCreateDto = z.infer<typeof createTreasuryExpenditureZodSchema>;
export type TreasuryExpenditureUpdateDto = z.infer<typeof updateTreasuryExpenditureZodSchema>;

export type TreasuryExpenditureResponseDto = {
    id: string;
    name: string;
    value: number;
    associatedSection: string;
    images: string[];

    createdAt: Date;
};

export function toTreasuryExpenditureResponseDto(data: TreasuryExpenditureDocument[]): TreasuryExpenditureResponseDto[];
export function toTreasuryExpenditureResponseDto(data: TreasuryExpenditureDocument): TreasuryExpenditureResponseDto;
export function toTreasuryExpenditureResponseDto(data: TreasuryExpenditureDocument | TreasuryExpenditureDocument[]) {
    if (Array.isArray(data)) {
        let result = [];
        for (const doc of data) {
            result.push(_toTreasuryExpenditureResponseDto(doc));
        }
        return result;
    }
    return _toTreasuryExpenditureResponseDto(data);
}

function _toTreasuryExpenditureResponseDto(doc: TreasuryExpenditureDocument): TreasuryExpenditureResponseDto {
    return {
        id: doc.serialID,
        name: doc.name,
        value: doc.value,
        associatedSection: doc.associatedSection,
        images: doc.images,

        createdAt: dateUtils.toLocaleDate(doc.createdAt)!,
    };
}
