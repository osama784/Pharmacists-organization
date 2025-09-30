import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, LeaseUpdateDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import { responseMessages } from "../../translation/response.ar";
import Lease from "../../models/lease.model";

const updateLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseUpdateDto = req.validatedData;
        const leaseId = req.params.id;
        const lease = await Lease.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (lease.closedOut) {
            res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.PREVENT_UPDATE_CLOSED_LEASE] });
            return;
        }
        await lease.updateOne(validatedData);
        const doc = await Lease.findById(leaseId);

        res.json({ success: true, data: toLeaseResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateLease;
