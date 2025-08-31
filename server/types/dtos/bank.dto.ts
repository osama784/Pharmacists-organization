import { z } from "zod";
import { BankCreateSchema, BankUpdateSchema } from "../../validators/bank.schema";
import { BankDocument } from "../models/bank.types";

export type CreateBankDto = z.infer<typeof BankCreateSchema>;
export type UpdateBankDto = z.infer<typeof BankUpdateSchema>;

export type BankResponseDto = {
    id: string;
    name: string;
    accounts: { section: string; accountNum: string }[];
};

export function toBankResponseDto(bank: BankDocument): BankResponseDto;
export function toBankResponseDto(bank: BankDocument[]): BankResponseDto[];
export function toBankResponseDto(data: BankDocument | BankDocument[]): BankResponseDto | BankResponseDto[] {
    if (Array.isArray(data)) {
        const result: BankResponseDto[] = [];
        for (const doc of data) {
            result.push(_toBankResponseDto(doc));
        }
        return result;
    }
    return _toBankResponseDto(data);
}

function _toBankResponseDto(doc: BankDocument): BankResponseDto {
    return {
        id: doc.id,
        name: doc.name,
        accounts: doc.accounts,
    };
}
