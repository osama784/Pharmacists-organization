import { Types } from "mongoose";
import { IFeeInvoice, IInvoice } from "../models/invoice.types.js";
import { IPharmacist } from "../models/pharmacist.types.js";

export type createInvoiceDto = {
    syndicateMembership: Types.ObjectId;
    createdAt: Date;
    fees: IFeeInvoice[];
};

export type invoiceResponseDto = Omit<IInvoice, "pharmacist"> & {
    pharmacist: IPharmacist;
};
