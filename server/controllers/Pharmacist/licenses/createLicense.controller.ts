import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { licenseModel, syndicateRecordModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { LicenseCreateDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";
import fs from "fs/promises";
import { processPharmacistImage } from "../../../utils/images";
import { PracticeState, Syndicate } from "../../../enums/pharmacist.enums";
import Lease from "../../../models/lease.model";
import { PharmacistModelTR } from "../../../translation/models.ar";

const createLicense = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: LicenseCreateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // handle currentLicense
        if (pharmacist.currentLicense) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.PHARMACIST_HAS_CURRENT_LICENSE] });
            return;
            // const currentLicense = await licenseModel.findById(pharmacist.currentLicense);
            // // check currentLicense endDate
            // if (currentLicense?.endDate && currentLicense.endDate > new Date()) {
            //     res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_CREATE_LICENSE] });
            //     return;
            // }
        }
        const lease = await Lease.findById(validatedData.relatedLease);
        if (!lease) {
            res.status(400).json({
                success: false,
                details: [`${PharmacistModelTR.licenses.relatedLease}: ${responseMessages.NOT_FOUND}`],
            });
            return;
        }
        // check if pharmacist is owner for a lease
        const leaseExist = await Lease.exists({ pharmacistOwner: pharmacist.id });
        if (leaseExist && !leaseExist._id.equals(validatedData.relatedLease)) {
            res.status(400).json({
                success: false,
                details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_CREATE_PHARMACIST_IF_HE_LICENSE_OWNER],
            });
            return;
        }
        const currentSyndicate = await syndicateRecordModel.findById(pharmacist.currentSyndicate);
        if (currentSyndicate?.syndicate == Syndicate.CENTRAL) {
            res.status(400).json({
                success: false,
                details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_CREATE_LICENSE_IN_CENTRAL_SYNDICATE],
            });
            return;
        }

        // handle uploaded files
        const imagesURLS: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processPharmacistImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "personal", pharmacistId: req.params.id }
                );
                imagesURLS.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
        }

        const license = await licenseModel.create({
            ...validatedData,
            images: imagesURLS,
            pharmacist: pharmacistId,
            syndicate: currentSyndicate?.syndicate,
        });
        let updatedFields: Record<string, any> = {
            $push: {
                licenses: license.id,
            },
            currentLicense: license.id,
            // practiceState: PracticeState.PRACTICED,
        };
        const doc = await pharmacistSchema
            .findOneAndUpdate(
                {
                    _id: pharmacistId,
                },
                updatedFields,
                {
                    new: true,
                }
            )
            .populate<{
                currentSyndicate: SyndicateRecordDocument;
                currentLicense: LicenseDocument;
                licenses: LicenseDocument[];
                syndicateRecords: SyndicateRecordDocument[];
                universityDegrees: UniversityDegreeDocument[];
                penalties: PenaltyDocument[];
            }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);
        await pharmacist.updateOne(updatedFields);

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createLicense;
