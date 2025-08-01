import { PopulatedInvoiceDocument } from "../models/invoice.types.js";
import { PharmacistDocument } from "../models/pharmacist.types.js";

export type createInvoiceDto = {
    syndicateMembership: string;
    createdAt?: Date;
};

export type updateInvoiceDto = Partial<createInvoiceDto> & {
    status?: string | null;
    fees?: { name: string; value: number }[];
};

export type InvoiceResponseDto = {
    id: string;
    pharmacist: PharmacistDocument;
    status?: string;
    syndicateMembership: string;
    total: number;
    paidDate?: Date;
    createdAt: Date;
    fees?: { name: string; value: number }[];
};

export function toInvoiceResponseDto(data: PopulatedInvoiceDocument): InvoiceResponseDto;
export function toInvoiceResponseDto(data: PopulatedInvoiceDocument[]): InvoiceResponseDto[];

export function toInvoiceResponseDto(
    data: PopulatedInvoiceDocument | PopulatedInvoiceDocument[]
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

function _toInvoiceResponseDto(doc: PopulatedInvoiceDocument): InvoiceResponseDto {
    return {
        id: doc.id,
        pharmacist: doc.pharmacist,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
        fees: doc.fees,
    };
}
function _toListInvoiceResponseDto(doc: PopulatedInvoiceDocument): InvoiceResponseDto {
    return {
        id: doc.id,
        pharmacist: doc.pharmacist,
        status: doc.status,
        syndicateMembership: doc.syndicateMembership,
        total: doc.total,
        paidDate: doc.paidDate,
        createdAt: doc.createdAt,
    };
}
