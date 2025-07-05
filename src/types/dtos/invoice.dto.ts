import { Types } from "mongoose";
import { IFeeInvoice, IInvoice } from "../models/invoice.types.js";
import { IPharmacist } from "../models/pharmacist.types.js";
import { IPracticeType } from "../models/practiceType.types.js";

export type createInvoiceDto = {
    practiceType: Types.ObjectId;
    createdAt: Date;
    fees: IFeeInvoice[];
};

export type invoiceResponseDto = Omit<IInvoice, "pharmacist | practiceType"> & {
    pharmacist: IPharmacist;
    practiceType: IPracticeType;
};
