import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto } from "../../types/dtos/lease.dto";
import { responseMessages } from "../../translation/response.ar";
import { leaseModel } from "../../models/lease.model";

const deleteLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const leaseId = req.params.id;
        const lease = await leaseModel.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await lease.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteLease;
