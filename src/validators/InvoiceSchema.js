import { z } from "zod";
import { invoiceStatuses } from "../models/Invoice.js";
import mongoose from "mongoose";
import PracticeType from "../models/PracticeType.js";

const InvoiceSchema = z.object({
    practiceType: z
        .string()
        .trim()
        .refine(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return false;
            }
            const condition = await PracticeType.exists({ _id: value });
            if (condition) {
                return true;
            }
            return false;
        }),
    status: z.enum(Object.values(invoiceStatuses)),
    createdAt: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
    paidDate: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
});

export const InvoiceUpdateFeesSchema = z.array(
    z.object({
        name: z.string().trim(),
        value: z.number(),
        section: z.string().trim(),
    })
);

export default InvoiceSchema;
