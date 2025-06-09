const { default: mongoose } = require("mongoose");

export const FeesChangeValuesSchema = z.array(
    z.object({
        id: z
            .string()
            .trim()
            .refine((value) => {
                return mongoose.Types.ObjectId.isValid(value);
            }),
        value: z.number().optional(),
        detail: z.array(
            z.object({
                year: z.number(),
                value: z.number(),
            })
        ),
    })
);
