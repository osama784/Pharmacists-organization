import { Types } from "mongoose";
import { PopulatedInvoiceDocument } from "../models/invoice.types.js";
import { PharmacistDocument } from "../models/pharmacist.types.js";

export type createInvoiceDto = {
    syndicateMembership: Types.ObjectId;
    createdAt?: Date;
    fees: { name: string; value: number }[];
};

export type InvoiceResponseDto = {
    id: string;
    pharmacist: PharmacistDocument;
    syndicateMembership: string;
    createdAt: Date;
    fees: { name: string; value: number }[];
};

export function toInvoiceResponseDto(data: PopulatedInvoiceDocument): InvoiceResponseDto {
    return {
        id: data.id,
        pharmacist: data.pharmacist,
        syndicateMembership: data.syndicateMembership,
        createdAt: data.createdAt,
        fees: data.fees,
    };
}
