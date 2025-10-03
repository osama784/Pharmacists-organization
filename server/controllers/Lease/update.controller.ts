import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, LeaseUpdateDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import { responseMessages } from "../../translation/response.ar";
import Lease from "../../models/lease.model";
import { licenseModel } from "../../models/pharmacist.model";

const updateLease = async (req: Request, res: TypedResponse<LeaseResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LeaseUpdateDto = req.validatedData;
        const leaseId = req.params.id;
        const lease = await Lease.findById(leaseId);
        if (!lease) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // prevent closedOut lease update
        if (lease.closedOut) {
            res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.PREVENT_UPDATE_CLOSED_LEASE] });
            return;
        }
        // check if closedOut=true
        if (validatedData.closedOut == true) {
            // check related Licenses
            const relatedLicenses = await licenseModel.find({ relatedLease: lease.id });
            if (!(relatedLicenses.length == 0)) {
                res.status(400).json({
                    success: false,
                    details: [responseMessages.LEASE_CONTROLLERS.SHOULD_TERMINATE_ALL_RELATED_LICENSES],
                });
                return;
            }
        }
        // check estateNum if isAvailable
        if (validatedData.estateNum) {
            const estatePlace = validatedData.estatePlace || lease.estatePlace;
            const isAvailable = await Lease.isEstateNumAvailable(validatedData.estateNum, estatePlace);
            if (!isAvailable) {
                res.status(400).json({ success: false, details: [responseMessages.LEASE_CONTROLLERS.UNAVAILABLE_ESTATE_NUM] });
                return;
            }
        }
        await lease.updateOne(validatedData);
        const doc = await Lease.findById(leaseId);

        res.json({ success: true, data: toLeaseResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateLease;
