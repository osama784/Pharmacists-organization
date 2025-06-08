import e, { Router } from "express";
import validate from "../middlewares/validate.js";
import authenticated from "../middlewares/authenticated.js";
import PharmacistSchema, {
    licenseSchema,
    penaltySchema,
    practiceRecordSchema,
    universityDegreeSchema,
} from "../validators/PharmacistSchema.js";
import createPharmacist from "../controllers/Pharmacist/create.js";
import checkRole from "../middlewares/checkRole.js";
import listPharmacists from "../controllers/Pharmacist/list.js";
import updatePharmacist from "../controllers/Pharmacist/update.js";
import deletePharmacist from "../controllers/Pharmacist/delete.js";
import createPracticeRecord from "../controllers/Pharmacist/practiceRecords/create.js";
import deletePracticeRecord from "../controllers/Pharmacist/practiceRecords/delete.js";
import updatePracticeRecord from "../controllers/Pharmacist/practiceRecords/update.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import createUniversityDegree from "../controllers/Pharmacist/universityDegrees/create.js";
import deleteUniversityDegree from "../controllers/Pharmacist/universityDegrees/delete.js";
import updateUniversityDegree from "../controllers/Pharmacist/universityDegrees/update.js";
import createLicense from "../controllers/Pharmacist/licenses/create.js";
import deleteLicense from "../controllers/Pharmacist/licenses/delete.js";
import updateLicense from "../controllers/Pharmacist/licenses/update.js";
import createPenalty from "../controllers/Pharmacist/penalties/create.js";
import updatePenalty from "../controllers/Pharmacist/penalties/update.js";

const router = Router();
router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.param("recordID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.get("/list", authenticated, checkRole(""), listPharmacists);
router.post("/create", authenticated, checkRole(""), validate(PharmacistSchema.partial()), createPharmacist);
router.patch("/update/:id", authenticated, checkRole(""), validate(PharmacistSchema), updatePharmacist);
router.delete("/delete/:id", authenticated, checkRole(""), deletePharmacist);

// practice records
router.post("/add-practice-record/:id", authenticated, checkRole(""), validate(practiceRecordSchema.partial()), createPracticeRecord);
router.delete("/delete-practice-record/:id/:recordID", authenticated, checkRole(""), deletePracticeRecord);
router.patch("/update-practice-record/:id/:recordID", authenticated, checkRole(""), updatePracticeRecord);

// university degrees
router.post(
    "/create-university-degree/:id/:universityDegreeID",
    authenticated,
    checkRole(""),
    validate(universityDegreeSchema.partial()),
    createUniversityDegree
);
router.delete("/delete-university-degree/:id/:universityDegreeID", authenticated, checkRole(""), deleteUniversityDegree);
router.patch(
    "/update-university-degree/:id/:universityDegreeID",
    authenticated,
    checkRole(""),
    validate(universityDegreeSchema.partial()),
    updateUniversityDegree
);

// licenses
router.post("/create-license/:id/:licenseID", authenticated, checkRole(""), validate(licenseSchema.partial()), createLicense);
router.delete("/delete-license/:id/:licenseID", authenticated, checkRole(""), deleteLicense);
router.patch("/update-license/:id/:licenseID", authenticated, checkRole(""), validate(licenseSchema.partial()), updateLicense);

// penalties
router.post("/create-penalty/:id/:penaltyID", authenticated, checkRole(""), validate(penaltySchema.partial()), createPenalty);
router.delete("/delete-penalty/:id/:penaltyID", authenticated, checkRole(""), updatePenalty);
router.patch("/update-penalty/:id/:penaltyID", authenticated, checkRole(""), validate(penaltySchema.partial()), updatePenalty);
