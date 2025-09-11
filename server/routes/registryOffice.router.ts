import { Router } from "express";
import passport from "passport";
import printDocuments from "../controllers/RegistryOffice/printDocuments.controller";
import validate from "../middlewares/validate.middleware";
import { RegistryOfficePrintDocumentSchema } from "../validators/registryOffice.schema";
import checkPermission from "../middlewares/checkPermission.middleware";
import permissions from "../utils/permissions";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/print-document", checkPermission(permissions.printDocument), validate(RegistryOfficePrintDocumentSchema), printDocuments);

export default router;
