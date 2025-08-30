import mongoose from "mongoose";
import { InvoiceDocument, PopulatedInvoiceDocument } from "../models/invoice.types.js";
import { PharmacistDocument } from "../models/pharmacist.types.js";
import { PharmacistResponseDto, toPharmacistResponseDto } from "./pharmacist.dto.js";

export type createInvoiceDto = {
    syndicateMembership: string;
    calculateFines?: boolean;
    willPracticeThisYear: boolean;
};

export type updateInvoiceDto = Partial<Omit<createInvoiceDto, "calculateFines" | "willPracticeThisYear">> & {
    status?: string | null;
    fees?: { name: string; value: number; numOfYears: number }[];
};

export type InvoiceResponseDto = {
    id: string;
    receiptNumber?: string;
    pharmacist: PharmacistResponseDto | mongoose.Types.ObjectId;
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
    let pharmacist: mongoose.Types.ObjectId | PharmacistResponseDto;
    if ("__v" in doc.pharmacist) {
        pharmacist = toPharmacistResponseDto(doc.pharmacist as PharmacistDocument);
    } else {
        pharmacist = doc.pharmacist;
    }
    return {
        id: doc.serialID,
        receiptNumber: doc.receiptNumber,
        pharmacist: pharmacist,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
        fees: doc.fees,
    };
}
function _toListInvoiceResponseDto(doc: PopulatedInvoiceDocument | InvoiceDocument): InvoiceResponseDto {
    let pharmacist: mongoose.Types.ObjectId | PharmacistResponseDto;
    if (doc.pharmacist && "__v" in doc.pharmacist) {
        pharmacist = toPharmacistResponseDto(doc.pharmacist as PharmacistDocument);
    } else {
        pharmacist = doc.pharmacist;
    }
    return {
        id: doc.serialID,
        receiptNumber: doc.receiptNumber,
        pharmacist: pharmacist,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
    };
}
