import e, { Router } from "express";
import validate from "../middlewares/validate";
import authenticated from "../middlewares/authenticated";
import PharmacistSchema, {
    licenseSchema,
    penaltySchema,
    practiceRecordSchema,
    universityDegreeSchema,
} from "../validators/PharmacistSchema";
import createPharmacist from "../controllers/Pharmacist/create";
import checkRole from "../middlewares/checkRole";
import listPharmacists from "../controllers/Pharmacist/list";
import updatePharmacist from "../controllers/Pharmacist/update";
import deletePharmacist from "../controllers/Pharmacist/delete";
import createPracticeRecord from "../controllers/Pharmacist/practiceRecords/create";
import deletePracticeRecord from "../controllers/Pharmacist/practiceRecords/delete";
import updatePracticeRecord from "../controllers/Pharmacist/practiceRecords/update";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import createUniversityDegree from "../controllers/Pharmacist/universityDegrees/create";
import deleteUniversityDegree from "../controllers/Pharmacist/universityDegrees/delete";
import updateUniversityDegree from "../controllers/Pharmacist/universityDegrees/update";
import createLicense from "../controllers/Pharmacist/licenses/create";
import deleteLicense from "../controllers/Pharmacist/licenses/delete";
import updateLicense from "../controllers/Pharmacist/licenses/update";
import createPenalty from "../controllers/Pharmacist/penalties/create";
import updatePenalty from "../controllers/Pharmacist/penalties/update";

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
