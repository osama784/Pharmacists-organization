import { Router } from "express";
import passport from "passport";
import validate from "../middlewares/validate.middleware.js";
import createPharmacist from "../controllers/Pharmacist/create.controller.js";
import checkPermissions from "../middlewares/checkPermissions.middleware.js";
import listPharmacists from "../controllers/Pharmacist/list.controller.js";
import updatePharmacist from "../controllers/Pharmacist/update.controller.js";
import deletePharmacist from "../controllers/Pharmacist/delete.controller.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import permissions from "../utils/permissions.js";
import {
    createPharmacistZodSchema,
    createLicenseZodSchema,
    updateLicenseZodSchema,
    createUniversityDegreeZodSchema,
    updateUniversityDegreeZodSchema,
    updatePharmacistZodSchema,
    createSyndicateRecordZodSchema,
    createPenaltyZodSchema,
    updatePenaltyZodSchema,
} from "../validators/pharmacist.schema.js";
import getPharmacist from "../controllers/Pharmacist/get.controller.js";
import exportPharmacistsAsExcel from "../controllers/Pharmacist/exportExcel.controller.js";
import { responseMessages } from "../translation/response.ar.js";
import upload, { checkBrowserWebpSupport } from "../middlewares/multer.middleware.js";
import downloadPharmacistImages from "../controllers/Pharmacist/downloadImages.controller.js";
import createLicense from "../controllers/Pharmacist/licenses/createLicense.controller.js";
import deleteLicense from "../controllers/Pharmacist/licenses/deleteLicense.controller.js";
import updateLicense from "../controllers/Pharmacist/licenses/updateLicense.controller.js";
import createPenalty from "../controllers/Pharmacist/penalties/createPenalty.controller.js";
import updatePenalty from "../controllers/Pharmacist/penalties/updatePenalty.controller.js";
import deletePenalty from "../controllers/Pharmacist/penalties/deletePenalty.controller.js";
import createSyndicateRecord from "../controllers/Pharmacist/syndicateRecords/createSyndicateRecord.controller.js";
import deleteSyndicateRecord from "../controllers/Pharmacist/syndicateRecords/deleteSyndicateRecord.controller.js";
import createUniversityDegree from "../controllers/Pharmacist/universityDegrees/createUniversityDegree.controller.js";
import updateUniversityDegree from "../controllers/Pharmacist/universityDegrees/updateUniversityDegree.controller.js";
import deleteUniversityDegree from "../controllers/Pharmacist/universityDegrees/deleteUniversityDegree.controller.js";
import printPhramacist from "../controllers/Pharmacist/print.controller.js";
import downloadPharmacistImagesSignedURL from "../controllers/Pharmacist/downloadImagesSignedURL.controller.js";
import terminateCurrentLicense from "../controllers/Pharmacist/licenses/terminateLicense.controller.js";

const router = Router();
router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("recordID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("licenseId", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("syndicateRecordId", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("universityDegreeId", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("penaltyId", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});

// insecure endpoint uses signed url
router.get("/download/:id/:folderToken", downloadPharmacistImagesSignedURL);

router.use(passport.authenticate("jwt", { session: false }));

router.get(
    "/list",
    checkPermissions([
        permissions.listPharmacists,
        permissions.createInvoice,
        permissions.updateInvoice,
        permissions.printRegistryOfficeDocument,
    ]),
    listPharmacists
);
router.get(
    "/detail/:id",
    checkPermissions([
        permissions.getPharmacist,
        permissions.createInvoice,
        permissions.updateInvoice,
        permissions.printRegistryOfficeDocument,
    ]),
    getPharmacist
);
router.post(
    "/create",
    checkPermissions(permissions.createPharmacist),
    upload.array("files"),
    validate(createPharmacistZodSchema),
    createPharmacist
);
router.patch(
    "/update/:id",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(updatePharmacistZodSchema),
    updatePharmacist
);
router.delete("/delete/:id", checkPermissions(permissions.deletePharmacist), deletePharmacist);

router.get("/export", checkPermissions(permissions.exportPharmacistsAsExcel), exportPharmacistsAsExcel);
router.get("/download/:id", checkPermissions(permissions.downloadPharmacistImages), downloadPharmacistImages);
router.get("/print/:id", checkPermissions(permissions.printPharmacist), printPhramacist);

router.post(
    "/:id/licenses/create",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(createLicenseZodSchema),
    createLicense
);
router.put(
    "/:id/licenses/update/:licenseId",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(updateLicenseZodSchema),
    updateLicense
);
router.delete("/:id/licenses/delete/:licenseId", checkPermissions(permissions.updatePharmacist), deleteLicense);
router.put("/:id/licenses/terminate-current-license", checkPermissions(permissions.updatePharmacist), terminateCurrentLicense);

router.post("/:id/penalties/create", checkPermissions(permissions.updatePharmacist), validate(createPenaltyZodSchema), createPenalty);
router.put(
    "/:id/penalties/update/:penaltyId",
    checkPermissions(permissions.updatePharmacist),
    validate(updatePenaltyZodSchema),
    updatePenalty
);
router.delete("/:id/penalties/delete/:penaltyId", checkPermissions(permissions.updatePharmacist), deletePenalty);

router.post(
    "/:id/syndicate-records/create",
    checkPermissions(permissions.updatePharmacist),
    validate(createSyndicateRecordZodSchema),
    createSyndicateRecord
);

router.delete("/:id/syndicate-records/delete/:syndicateRecordId", checkPermissions(permissions.updatePharmacist), deleteSyndicateRecord);

router.post(
    "/:id/university-degrees/create",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(createUniversityDegreeZodSchema),
    createUniversityDegree
);
router.put(
    "/:id/university-degrees/update/:universityDegreeId",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(updateUniversityDegreeZodSchema),
    updateUniversityDegree
);
router.delete("/:id/university-degrees/delete/:universityDegreeId", checkPermissions(permissions.updatePharmacist), deleteUniversityDegree);

export default router;
