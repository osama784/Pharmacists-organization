import { z } from "zod";
import { BooleanSchema, DateSchema, mongooseIDSchema, StringSchema } from "../utils/customSchemas";
import { LeaseModelTR } from "../translation/models.ar";
import Pharmacist from "../models/pharmacist.model";

const leaseZodSchema = z.object({
    // staffPharmacists: z.array(mongooseIDSchema({keyName: LeaseModelTR.staffPharmacists})).refine( (data) => {
    //     data.forEach(async (staff) => {
    //         const doc = await Pharmacist.findById(staff)
    //         if (!doc) {
    //             return false
    //         }
    //     })
    //     return true
    // }, {message: }),
    estatePlace: StringSchema({ keyName: LeaseModelTR.estatePlace }),
    estateNum: StringSchema({ keyName: LeaseModelTR.estateNum }),
    startDate: DateSchema({ keyName: LeaseModelTR.startDate }),
    endDate: DateSchema({ keyName: LeaseModelTR.endDate, optional: true }),
    closedOut: BooleanSchema({ keyName: LeaseModelTR.closedOut }),
});

export const createLeaseZodSchema = leaseZodSchema.omit({ closedOut: true });
export const updateLeaseZodSchema = leaseZodSchema.partial();
