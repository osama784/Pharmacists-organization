import mongoose from "mongoose";
import { InvoiceDocument, PopulatedInvoiceDocument } from "../models/invoice.types.js";
import { PharmacistDocument } from "../models/pharmacist.types.js";
import { PharmacistResponseDto, toPharmacistResponseDto } from "./pharmacist.dto.js";
import { BankResponseDto, toBankResponseDto } from "./bank.dto.js";
import { IBank } from "../models/bank.types.js";

export type createInvoiceDto = {
    syndicateMembership: string;
    bank: string;
    calculateFines?: boolean;
    willPracticeThisYear: boolean;
};

export type updateInvoiceDto = Partial<Omit<createInvoiceDto, "calculateFines" | "willPracticeThisYear" | "bank">> & {
    status?: string | null;
    fees?: { name: string; value: number; numOfYears: number }[];
};

export type InvoiceResponseDto = {
    id: string;
    receiptNumber?: string;
    pharmacist: PharmacistResponseDto | string;
    bank: IBank | string;
    status: string;
    syndicateMembership: string;
    total: number;
    paidDate?: Date;
    createdAt: Date;
    fees?: { name: string; value: number; numOfYears: number }[];
};

export function toInvoiceResponseDto(data: PopulatedInvoiceDocument | InvoiceDocument): InvoiceResponseDto;
export function toInvoiceResponseDto(data: PopulatedInvoiceDocument[] | InvoiceDocument[]): InvoiceResponseDto[];

export function toInvoiceResponseDto(
    data: PopulatedInvoiceDocument | InvoiceDocument | PopulatedInvoiceDocument[] | InvoiceDocument[]
): InvoiceResponseDto | InvoiceResponseDto[] {
    if (Array.isArray(data)) {
        const result: InvoiceResponseDto[] = [];
        for (const doc of data) {
            result.push(_toListInvoiceResponseDto(doc));
        }
        return result;
    }
    return _toInvoiceResponseDto(data);
}

function _toInvoiceResponseDto(doc: PopulatedInvoiceDocument | InvoiceDocument): InvoiceResponseDto {
    let pharmacist: string | PharmacistResponseDto;
    if ("__v" in doc.pharmacist) {
        pharmacist = toPharmacistResponseDto(doc.pharmacist as PharmacistDocument);
    } else {
        pharmacist = doc.pharmacist.toString();
    }
    return {
        id: doc.serialID,
        receiptNumber: doc.receiptNumber,
        pharmacist: pharmacist,
        bank: doc.bank,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
        fees: doc.fees,
    };
}
function _toListInvoiceResponseDto(doc: PopulatedInvoiceDocument | InvoiceDocument): InvoiceResponseDto {
    let pharmacist: string | PharmacistResponseDto;
    if ("__v" in doc.pharmacist) {
        pharmacist = toPharmacistResponseDto(doc.pharmacist as PharmacistDocument);
    } else {
        pharmacist = doc.pharmacist.toString();
    }
    return {
        id: doc.serialID,
        receiptNumber: doc.receiptNumber,
        pharmacist: pharmacist,
        bank: doc.bank.name,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
    };
}
