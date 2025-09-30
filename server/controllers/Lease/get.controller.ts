import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import Lease from "../../models/lease.model";
import { responseMessages } from "../../translation/response.ar";

const getLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const leaseId = req.params.id;
        const lease = await Lease.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        res.json({ success: true, data: toLeaseResponseDto(lease) });
    } catch (e) {
        next(e);
    }
};

export default getLease;
