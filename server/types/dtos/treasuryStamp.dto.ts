import { z } from "zod";
import { dateUtils } from "../../utils/dateUtils";
import { TreasuryStampDocument } from "../models/treasuryStamp.types";
import { TreasuryStampCreateSchema, TreasuryStampUpdateSchema } from "../../validators/treasuryStamp.schema";

export type TreasuryStampCreateDto = z.infer<typeof TreasuryStampCreateSchema>;
export type TreasuryStampUpdateDto = z.infer<typeof TreasuryStampUpdateSchema>;

export type TreasuryStampResponseDto = {
    id: string;
    name: string;
    value: number;
    initialQuantity: number;
    soldQuantity: number;

    createdAt: Date;
};

export function toTreasuryStampResponseDto(data: TreasuryStampDocument): TreasuryStampResponseDto;
export function toTreasuryStampResponseDto(data: TreasuryStampDocument[]): TreasuryStampResponseDto[];
export function toTreasuryStampResponseDto(data: TreasuryStampDocument | TreasuryStampDocument[]) {
    if (Array.isArray(data)) {
        let result: TreasuryStampResponseDto[] = [];
        for (const doc of data) {
            result.push(_toTreasuryStampResponseDto(doc));
        }
        return result;
    }
    return _toTreasuryStampResponseDto(data);
}

function _toTreasuryStampResponseDto(doc: TreasuryStampDocument): TreasuryStampResponseDto {
    return {
        id: doc.serialID,
        name: doc.name,
        value: doc.value,
        initialQuantity: doc.initialQuantity,
        soldQuantity: doc.soldQuantity,
        createdAt: dateUtils.toLocaleDate(doc.createdAt)!,
    };
}
