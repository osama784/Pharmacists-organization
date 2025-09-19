import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import path from "path";
import fs from "fs/promises";
import { PARENT_DIR } from "../../../utils/images";

const deleteLicense = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const licenseId = req.params.licenseId;
        const pharmacistId = req.params.id;

        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const exist = pharmacist.licenses.find((value) => value._id.toString() == licenseId);
        if (!exist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const deletedImages = exist.images;
        for (const image of deletedImages) {
            const imagePath = path.join(PARENT_DIR, image);
            try {
                await fs.unlink(imagePath);
            } catch (e) {
                console.log(e);
            }
        }
        const doc = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
            },
            {
                $pull: {
                    licenses: { _id: licenseId },
                },
            },
            {
                new: true,
            }
        );
        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default deleteLicense;
