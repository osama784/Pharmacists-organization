import { Router } from "express";
import passport from "passport";
import validate from "../middlewares/validate.middleware.js";
import createPharmacist from "../controllers/Pharmacist/create.controller.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import listPharmacists from "../controllers/Pharmacist/list.controller.js";
import updatePharmacist from "../controllers/Pharmacist/update.controller.js";
import deletePharmacist from "../controllers/Pharmacist/delete.controller.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import permissions from "../utils/permissions.js";
import {
    CreatePharmacistSchema,
    CreateLicenseSchema,
    UpdateLicenseSchema,
    PenaltySchema,
    PracticeRecordSchema,
    SyndicateRecordSchema,
    CreateUniversityDegreeSchema,
    UpdateUniversityDegreeSchema,
    UpdatePharmacistSchema,
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
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermission(permissions.listPharmacists), listPharmacists);
router.get("/detail/:id", checkPermission(permissions.getPharmacist), getPharmacist);
router.get("/export", exportPharmacistsAsExcel);
router.post(
    "/create",
    checkPermission(permissions.createPharmacist),
    upload.array("file"),
    validate(CreatePharmacistSchema),
    createPharmacist
);
router.patch(
    "/update/:id",
    checkPermission(permissions.updatePharmacist),
    upload.array("file"),
    validate(UpdatePharmacistSchema),
    updatePharmacist
);
router.delete("/delete/:id", checkPermission(permissions.deletePharmacist), deletePharmacist);

router.get("/download/:id", downloadPharmacistImages);

router.post(
    "/:id/licenses/create",
    checkPermission(permissions.updatePharmacist),
    upload.array("file"),
    validate(CreateLicenseSchema),
    createLicense
);
router.put(
    "/:id/licenses/update/:licenseId",
    checkPermission(permissions.updatePharmacist),
    upload.array("file"),
    validate(UpdateLicenseSchema),
    updateLicense
);
router.delete("/:id/licenses/delete/:licenseId", checkPermission(permissions.updatePharmacist), deleteLicense);

router.post("/:id/penalties/create", checkPermission(permissions.updatePharmacist), validate(PenaltySchema), createPenalty);
router.put("/:id/penalties/update/:penaltyId", checkPermission(permissions.updatePharmacist), validate(PenaltySchema), updatePenalty);
router.delete("/:id/penalties/delete/:penaltyId", checkPermission(permissions.updatePharmacist), deletePenalty);

router.post(
    "/:id/syndicate-records/create",
    checkPermission(permissions.updatePharmacist),
    validate(SyndicateRecordSchema),
    createSyndicateRecord
);
router.put(
    "/:id/syndicate-records/update/:syndicateRecordId",
    checkPermission(permissions.updatePharmacist),
    validate(SyndicateRecordSchema),
    updateSyndicateRecord
);
router.delete("/:id/syndicate-records/delete/:syndicateRecordId", checkPermission(permissions.updatePharmacist), deleteSyndicateRecord);

router.post(
    "/:id/practice-records/create",
    checkPermission(permissions.updatePharmacist),
    validate(PracticeRecordSchema),
    createPracticeRecord
);
router.put(
    "/:id/practice-records/update/:practiceRecordId",
    checkPermission(permissions.updatePharmacist),
    validate(PracticeRecordSchema),
    updatePracticeRecord
);
router.delete("/:id/practice-records/delete/:practiceRecordId", checkPermission(permissions.updatePharmacist), deletePracticeRecord);

router.post(
    "/:id/university-degrees/create",
    checkPermission(permissions.updatePharmacist),
    upload.array("file"),
    validate(CreateUniversityDegreeSchema),
    createUniversityDegree
);
router.put(
    "/:id/university-degrees/update/:universityDegreeId",
    checkPermission(permissions.updatePharmacist),
    upload.array("file"),
    validate(UpdateUniversityDegreeSchema),
    updateUniversityDegree
);
router.delete("/:id/university-degrees/delete/:universityDegreeId", checkPermission(permissions.updatePharmacist), deleteUniversityDegree);

export default router;
