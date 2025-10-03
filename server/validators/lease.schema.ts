import { z } from "zod";
import { BooleanSchema, DateSchema, mongooseIDSchema, StringSchema } from "../utils/customSchemas";
import { LeaseModelTR } from "../translation/models.ar";
import Pharmacist from "../models/pharmacist.model";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

const leaseZodSchema = z.object({
    // staffPharmacists: z.array(mongooseIDSchema({ keyName: LeaseModelTR.staffPharmacists })).refine(
    //     (data) => {
    //         data.forEach(async (staff) => {
    //             const doc = await Pharmacist.findById(staff);
    //             if (!doc) {
    //                 return false;
    //             }
    //         });
    //         return true;
    //     },
    //     { message: zodSchemasMessages.LEASE_SCHEMA.NOT_FOUND_STAFF_PHARMACISTS }
    // ),
    name: StringSchema({ keyName: LeaseModelTR.name }),
    pharmacistOwner: mongooseIDSchema({ keyName: LeaseModelTR.pharmacistOwner }),
    estatePlace: StringSchema({ keyName: LeaseModelTR.estatePlace }),
    estateNum: StringSchema({ keyName: LeaseModelTR.estateNum }),
    startDate: DateSchema({ keyName: LeaseModelTR.startDate }),
    endDate: DateSchema({ keyName: LeaseModelTR.endDate, optional: true }),
    closedOut: BooleanSchema({ keyName: LeaseModelTR.closedOut }),
});

export const createLeaseZodSchema = leaseZodSchema.omit({ closedOut: true });
export const updateLeaseZodSchema = leaseZodSchema.omit({ pharmacistOwner: true }).partial();
