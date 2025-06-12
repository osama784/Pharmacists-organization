import mongoose from "mongoose";
import { z } from "zod";

export const FeesChangeValuesSchema = z.array(
    z.object({
        id: z
            .string()
            .trim()
            .refine((value) => {
                return mongoose.Types.ObjectId.isValid(value);
            }),
        value: z.number().optional(),
        detail: z
            .object({})
            .catchall(z.number())
            .transform((value) => {
                return new Map(Object.entries(value));
            })
            .optional(),
    })
);
