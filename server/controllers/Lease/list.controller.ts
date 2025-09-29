import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import { leaseModel } from "../../models/lease.model";

const listLeases = async (req: Request, res: TypedResponse<LeaseResponseDto[]>, next: NextFunction) => {
    try {
        const leases = await leaseModel.find();

        res.json({ success: true, data: toLeaseResponseDto(leases) });
    } catch (e) {
        next(e);
    }
};

export default listLeases;
