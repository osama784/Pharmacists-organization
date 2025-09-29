import { z } from "zod";
import { dateUtils } from "../../utils/dateUtils";
import { PopulatedTreasuryFeeDocument, TreasuryFeeDocument } from "../models/treasuryFee.types";
import { createTreasuryFeeZodSchema, updateTreasuryFeeZodSchema } from "../../validators/treasuryFee.schema";

export type TreasuryFeeResponseDto = {
    id: string;
    name: string;
    value: number;
    associatedParty?: string;
    associatedSection: string;
    receiptBook: string;
    createdAt: Date;
};

export type CreateTreasuryFeeDto = z.infer<typeof createTreasuryFeeZodSchema>;
export type UpdateTreasuryFeeDto = z.infer<typeof updateTreasuryFeeZodSchema>;

export function toTreasuryFeeResponseDto(doc: TreasuryFeeDocument): TreasuryFeeResponseDto;
export function toTreasuryFeeResponseDto(doc: PopulatedTreasuryFeeDocument): TreasuryFeeResponseDto;
export function toTreasuryFeeResponseDto(doc: TreasuryFeeDocument | PopulatedTreasuryFeeDocument): TreasuryFeeResponseDto {
    if ("__v" in doc.associatedSection) {
        return {
            id: doc.id,
            name: doc.name,
            value: doc.value,
            associatedParty: doc.associatedParty,
            associatedSection: doc.associatedSection.name,
            receiptBook: doc.receiptBook,
            createdAt: dateUtils.toLocaleDate(doc.createdAt)!,
        };
    }
    return {
        id: doc.id,
        name: doc.name,
        value: doc.value,
        associatedParty: doc.associatedParty,
        associatedSection: doc.associatedSection.toString(),
        receiptBook: doc.receiptBook,
        createdAt: dateUtils.toLocaleDate(doc.createdAt)!,
    };
}
