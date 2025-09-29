import { NextFunction, Request, TypedResponse } from "express";
import { LeaseCreateDto, LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import Pharmacist from "../../models/pharmacist.model";
import { responseMessages } from "../../translation/response.ar";
import { leaseModel } from "../../models/lease.model";

const createLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseCreateDto = req.validatedData;
        const pharmacistOwnerId = req.params.pharmacistOwnerId;
        const pharmacist = await Pharmacist.findById(pharmacistOwnerId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const lease = await leaseModel.create({ ...validatedData, pharmacistOwner: pharmacistOwnerId });

        res.json({ success: true, data: toLeaseResponseDto(lease) });
    } catch (e) {
        next(e);
    }
};

export default createLease;
