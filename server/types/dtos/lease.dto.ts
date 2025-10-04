import { Types } from "mongoose";
import { isPharmacyLease, LeaseDocument } from "../models/lease.types";
import { dateUtils } from "../../utils/dateUtils";
import { z } from "zod";
import { createLeaseZodSchema, updateLeaseZodSchema } from "../../validators/lease.schema";
import { PharmacistResponseDto, toPharmacistResponseDto } from "./pharmacist.dto";

export type LeaseCreateDto = z.infer<typeof createLeaseZodSchema>;
export type LeaseUpdateDto = z.infer<typeof updateLeaseZodSchema>;

export type LeaseResponseDto = {
    id: string;
    name: string;
    pharmacistOwner?: string | PharmacistResponseDto;
    // staffPharmacists: string[];
    estatePlace: string;
    estateNum: string;
    startDate: Date;
    endDate?: Date;
    closedOut: boolean;
};

export function toLeaseResponseDto(data: LeaseDocument): LeaseResponseDto;
export function toLeaseResponseDto(data: LeaseDocument[]): LeaseResponseDto[];
export function toLeaseResponseDto(data: LeaseDocument | LeaseDocument[]): LeaseResponseDto | LeaseResponseDto[] {
    if (Array.isArray(data)) {
        let result: LeaseResponseDto[] = [];
        for (const doc of data) {
            result.push(_toLeaseResponseDto(doc));
        }
        return result;
    }
    return _toLeaseResponseDto(data);
}

function _toLeaseResponseDto(doc: LeaseDocument): LeaseResponseDto {
    // const staffPharmacists = doc.staffPharmacists.map((staff) => staff.toString());
    let pharmacistOwner: string | PharmacistResponseDto | undefined = undefined;
    if (isPharmacyLease(doc)) {
        if ("__v" in doc.pharmacistOwner) {
            pharmacistOwner = toPharmacistResponseDto(doc.pharmacistOwner);
        } else {
            pharmacistOwner = doc.pharmacistOwner.toString();
        }
    }

    return {
        id: doc.id,
        name: doc.name,
        pharmacistOwner: pharmacistOwner,
        // staffPharmacists: staffPharmacists,
        estatePlace: doc.estatePlace,
        estateNum: doc.estateNum,
        startDate: dateUtils.toLocaleDate(doc.startDate)!,
        endDate: dateUtils.toLocaleDate(doc.endDate)!,
        closedOut: doc.closedOut,
    };
}
