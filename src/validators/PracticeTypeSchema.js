import { z } from "zod";
import Pharmacist from "../models/Pharmacist.js";
import PracticeType from "../models/PracticeType.js";
import mongoose from "mongoose";

const getRelatedFeesSchema = z.object({
    pharmacist: z
        .string()
        .trim()
        .refine(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return false;
            }
            const exists = await Pharmacist.exists({ _id: value });
            if (exists) {
                return true;
            }
            return false;
        }, "no pharmacist found with the given ID"),
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
});

export default getRelatedFeesSchema;
