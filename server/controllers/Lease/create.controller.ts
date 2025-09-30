import { NextFunction, Request, TypedResponse } from "express";
import { LeaseCreateDto, LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import Pharmacist from "../../models/pharmacist.model";
import { responseMessages } from "../../translation/response.ar";
import Lease from "../../models/lease.model";

const createLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseCreateDto = req.validatedData;
        // const pharmacistOwnerId = req.params.pharmacistOwnerId;
        // const pharmacistOwner = await Pharmacist.findById(pharmacistOwnerId);
        // if (!pharmacistOwner) {
        //     res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
        //     return;
        // }
        const isAvailable = await Lease.isEstateNumAvailable(validatedData.estateNum);
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
