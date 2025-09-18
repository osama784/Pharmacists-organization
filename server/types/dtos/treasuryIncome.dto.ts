import { z } from "zod";
import { TreasuryIncomeDocument } from "../models/treasuryIncome.types";
import { TreasuryIncomeCreateSchema, TreasuryIncomeUpdateSchema } from "../../validators/treasuryIncome.schema";
import { dateUtils } from "../../utils/dateUtils";

export type TreasuryIncomeCreateDto = z.infer<typeof TreasuryIncomeCreateSchema>;
export type TreasuryIncomeUpdateDto = z.infer<typeof TreasuryIncomeUpdateSchema>;

export type TreasuryIncomeResponseDto = {
    id: string;
    name: string;
    value: number;
    associatedSection: string;
    image?: string;

    createdAt: Date;
};

export function toTreasuryIncomeResponseDto(data: TreasuryIncomeDocument[]): TreasuryIncomeResponseDto[];
export function toTreasuryIncomeResponseDto(data: TreasuryIncomeDocument): TreasuryIncomeResponseDto;
export function toTreasuryIncomeResponseDto(data: TreasuryIncomeDocument | TreasuryIncomeDocument[]) {
    if (Array.isArray(data)) {
        let result = [];
        for (const doc of data) {
            result.push(_toTreasuryIncomeResponseDto(doc));
        }
        return result;
    }
    return _toTreasuryIncomeResponseDto(data);
}

function _toTreasuryIncomeResponseDto(doc: TreasuryIncomeDocument): TreasuryIncomeResponseDto {
    return {
        id: doc.serialID,
        name: doc.name,
        value: doc.value,
        associatedSection: doc.associatedSection,
        image: doc.image,

        createdAt: dateUtils.toLocaleDate(doc.createdAt)!,
    };
}
