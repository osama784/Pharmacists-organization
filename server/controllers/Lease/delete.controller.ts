import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto } from "../../types/dtos/lease.dto";
import { responseMessages } from "../../translation/response.ar";
import Lease from "../../models/lease.model";
import { licenseModel } from "../../models/pharmacist.model";

const deleteLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const leaseId = req.params.id;
        const lease = await Lease.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // check related licenses
        const relatedLicenses = await licenseModel.find({ relatedLease: lease.id });
        if (!(relatedLicenses.length == 0)) {
            res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.SHOULD_TERMINATE_ALL_RELATED_LICENSES] });
            return;
        }
        await lease.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteLease;
