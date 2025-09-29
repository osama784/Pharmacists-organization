import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, LeaseUpdateDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import { responseMessages } from "../../translation/response.ar";
import { leaseModel } from "../../models/lease.model";

const updateLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseUpdateDto = req.validatedData;
        const leaseId = req.params.id;
        const lease = await leaseModel.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await lease.updateOne(validatedData);
        const doc = await leaseModel.findById(leaseId);

        res.json({ success: true, data: toLeaseResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateLease;
