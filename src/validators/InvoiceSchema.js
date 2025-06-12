import { z } from "zod";
import { invoiceStatuses } from "../models/Invoice.js";
import mongoose from "mongoose";
import PracticeType from "../models/PracticeType.js";
import Section from "../models/Section.js";
import Fee from "../models/Fee.js";

const InvoiceSchema = z.object({
    practiceType: z
        .string()
        .trim()
        .refine(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return false;
            }
            const exists = await PracticeType.exists({ _id: value });
            if (exists) {
                return true;
            }
            return false;
        }, "no practiceType found with the given ID"),
    status: z.enum(Object.values(invoiceStatuses)).default(invoiceStatuses.ready),
    createdAt: z
        .string()
        .trim()
        .default(new Date().toISOString())
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
        _id: z
            .string()
            .trim()
            .default(null)
            .refine(async (value) => {
                if (value == null) {
                    return true;
                }
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return false;
                }
                const exists = await Fee.exists({ _id: value });
                if (exists) {
                    return true;
                }
                return false;
            }, "please send a valid fee id")
            .optional(),

        name: z.string().trim(),
        value: z.number(),
        sectionName: z.string().trim(),
        sectionID: z
            .string()
            .trim()
            .default(null)
            .refine(async (value) => {
                if (value == null) {
                    return true;
                }
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return false;
                }
                const exists = await Section.exists({ _id: value });
                if (exists) {
                    return true;
                }
                return false;
            }, "please send a valid section id")
            .optional(),
    })
);

export default InvoiceSchema;
