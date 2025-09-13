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
    PharmacistCreateSchema,
    LicenseCreateSchema,
    LicenseUpdateSchema,
    UniversityDegreeCreateSchema,
    UniversityDegreeUpdateSchema,
    PharmacistUpdateSchema,
    SyndicateRecordCreateSchema,
    SyndicateRecordUpdateSchema,
    PracticeRecordCreateSchema,
    PracticeRecordUpdateSchema,
    PenaltyCreateSchema,
    PenaltyUpdateSchema,
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
import updateSyndicateRecord from "../controllers/Pharmacist/syndicateRecords/updateSyndicateRecord.controller.js";
import deleteSyndicateRecord from "../controllers/Pharmacist/syndicateRecords/deleteSyndicateRecord.controller.js";
import createPracticeRecord from "../controllers/Pharmacist/practiceRecords/createPracticeRecord.controller.js";
import updatePracticeRecord from "../controllers/Pharmacist/practiceRecords/updatePracticeRecord.controller.js";
import deletePracticeRecord from "../controllers/Pharmacist/practiceRecords/deletePracticeRecord.controller.js";
import createUniversityDegree from "../controllers/Pharmacist/universityDegrees/createUniversityDegree.controller.js";
import updateUniversityDegree from "../controllers/Pharmacist/universityDegrees/updateUniversityDegree.controller.js";
import deleteUniversityDegree from "../controllers/Pharmacist/universityDegrees/deleteUniversityDegree.controller.js";
import printPhramacist from "../controllers/Pharmacist/printPharmacist.controller.js";
import downloadPharmacistImagesSignedURL from "../controllers/Pharmacist/downloadImagesSignedURL.controller.js";

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
router.param("practiceRecordId", (req, res, next, value, name) => {
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
    validate(PharmacistCreateSchema),
    createPharmacist
);
router.patch(
    "/update/:id",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(PharmacistUpdateSchema),
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
    validate(LicenseCreateSchema),
    createLicense
);
router.put(
    "/:id/licenses/update/:licenseId",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(LicenseUpdateSchema),
    updateLicense
);
router.delete("/:id/licenses/delete/:licenseId", checkPermissions(permissions.updatePharmacist), deleteLicense);

router.post("/:id/penalties/create", checkPermissions(permissions.updatePharmacist), validate(PenaltyCreateSchema), createPenalty);
router.put(
    "/:id/penalties/update/:penaltyId",
    checkPermissions(permissions.updatePharmacist),
    validate(PenaltyUpdateSchema),
    updatePenalty
);
router.delete("/:id/penalties/delete/:penaltyId", checkPermissions(permissions.updatePharmacist), deletePenalty);

router.post(
    "/:id/syndicate-records/create",
    checkPermissions(permissions.updatePharmacist),
    validate(SyndicateRecordCreateSchema),
    createSyndicateRecord
);
router.put(
    "/:id/syndicate-records/update/:syndicateRecordId",
    checkPermissions(permissions.updatePharmacist),
    validate(SyndicateRecordUpdateSchema),
    updateSyndicateRecord
);
router.delete("/:id/syndicate-records/delete/:syndicateRecordId", checkPermissions(permissions.updatePharmacist), deleteSyndicateRecord);

router.post(
    "/:id/practice-records/create",
    checkPermissions(permissions.updatePharmacist),
    validate(PracticeRecordCreateSchema),
    createPracticeRecord
);
router.put(
    "/:id/practice-records/update/:practiceRecordId",
    checkPermissions(permissions.updatePharmacist),
    validate(PracticeRecordUpdateSchema),
    updatePracticeRecord
);
router.delete("/:id/practice-records/delete/:practiceRecordId", checkPermissions(permissions.updatePharmacist), deletePracticeRecord);

router.post(
    "/:id/university-degrees/create",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(UniversityDegreeCreateSchema),
    createUniversityDegree
);
router.put(
    "/:id/university-degrees/update/:universityDegreeId",
    checkPermissions(permissions.updatePharmacist),
    upload.array("files"),
    validate(UniversityDegreeUpdateSchema),
    updateUniversityDegree
);
router.delete("/:id/university-degrees/delete/:universityDegreeId", checkPermissions(permissions.updatePharmacist), deleteUniversityDegree);

export default router;
