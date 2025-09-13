import { Router } from "express";
import passport from "passport";
import printDocuments from "../controllers/RegistryOffice/printDocuments.controller";
import validate from "../middlewares/validate.middleware";
import { RegistryOfficePrintDocumentSchema } from "../validators/registryOffice.schema";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import getSecretaryName from "../controllers/RegistryOffice/getSecretaryName.controller";
import updateSecretaryName from "../controllers/RegistryOffice/updateSecretaryName.controller";
import getPresidentName from "../controllers/RegistryOffice/getPresidentName.controller";
import updatePresidentName from "../controllers/RegistryOffice/updatePresidentName.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
    "/print-document",
    checkPermissions(permissions.printRegistryOfficeDocument),
    validate(RegistryOfficePrintDocumentSchema),
    printDocuments
);

router.get("/secretary", checkPermissions(permissions.readSecretary), getSecretaryName);
router.put("/secretary", checkPermissions(permissions.updateSecretary), updateSecretaryName);
router.get("/president", checkPermissions(permissions.readPresident), getPresidentName);
router.put("/president", checkPermissions(permissions.updatePresident), updatePresidentName);

export default router;
