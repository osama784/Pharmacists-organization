import { NextFunction, Request, TypedResponse } from "express";
import { LeaseCreateDto, LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import Pharmacist from "../../models/pharmacist.model";
import { responseMessages } from "../../translation/response.ar";
import Lease from "../../models/lease.model";
import { LeaseModelTR } from "../../translation/models.ar";
import { LeaseType } from "../../enums/lease.enums";

const createLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseCreateDto = req.validatedData;
        // validate pharmacistOwner if leaseType is Pharmacy
        if (validatedData.leaseType == LeaseType.PHARMACY && !validatedData.pharmacistOwner) {
            res.status(400).json({ success: false, details: [`${LeaseModelTR.pharmacistOwner}: ${responseMessages.INVALID_MONGOOSE_ID}`] });
            return;
        }
        if (validatedData.leaseType == LeaseType.PHARMACY) {
            const pharmacistOwner = await Pharmacist.findById(validatedData.pharmacistOwner);
            if (!pharmacistOwner) {
                res.status(400).json({ success: false, details: [`${LeaseModelTR.pharmacistOwner}: ${responseMessages.NOT_FOUND}`] });
                return;
            }
            // check if pharmacist is owner for another lease
            const leaseExist = await Lease.findOne({ pharmacistOwner: pharmacistOwner.id });
            if (leaseExist) {
                res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.PHARMACIST_OWNRE_FOR_ANOTHER_LEASE] });
                return;
            }
        }
        const isAvailable = await Lease.isEstateNumAvailable(validatedData.estateNum, validatedData.estatePlace);
        if (!isAvailable) {
            res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.UNAVAILABLE_ESTATE_NUM] });
            return;
        }
        const lease = await Lease.create(validatedData);

        res.json({ success: true, data: toLeaseResponseDto(lease) });
    } catch (e) {
        next(e);
    }
};

export default createLease;
