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
    fees: z
        .array(
            z.object({
                feeRef: z
                    .string()
                    .trim()
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
                    }, "please send a valid fee id"),
                feeName: z
                    .string()
                    .trim()
                    .refine(async (value) => {
                        const exists = await Fee.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    }),
                sectionName: z
                    .string()
                    .trim()
                    .refine(async (value) => {
                        const exists = await Section.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    }),
                value: z.number(),
            })
        )
        .refine(async (fees) => {
            // check all fees' IDs get sent
            const sections = await Section.find();
            const excludedFees = sections.map((section) => section.fineSummaryFee);
            const allFees = (await Fee.find({ _id: { $nin: excludedFees } })).map((fee) => fee.id);
            if (fees.length != allFees.length) {
                return false;
            }

            const filteredFees = fees.filter((fee) => !allFees.includes(fee.feeRef.toString()));

            return filteredFees.length == 0;
        }, "please send a complete list of fees"),
});

export default InvoiceSchema;
