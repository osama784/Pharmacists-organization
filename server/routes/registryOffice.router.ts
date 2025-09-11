import { Router } from "express";
import passport from "passport";
import printDocuments from "../controllers/RegistryOffice/printDocuments.controller";
import validate from "../middlewares/validate.middleware";
import { RegistryOfficePrintDocumentSchema } from "../validators/registryOffice.schema";
import checkPermission from "../middlewares/checkPermission.middleware";
import permissions from "../utils/permissions";
import getSecretaryName from "../controllers/RegistryOffice/getSecretaryName.controller";
import updateSecretaryName from "../controllers/RegistryOffice/updateSecretaryName.controller";
import getPresidentName from "../controllers/RegistryOffice/getPresidentName.controller";
import updatePresidentName from "../controllers/RegistryOffice/updatePresidentName.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/print-document", checkPermission(permissions.printDocument), validate(RegistryOfficePrintDocumentSchema), printDocuments);

router.get("/secretary", checkPermission(permissions.readSecretary), getSecretaryName);
router.put("/secretary", checkPermission(permissions.updateSecretary), updateSecretaryName);
router.get("/president", checkPermission(permissions.readPresident), getPresidentName);
router.put("/president", checkPermission(permissions.updatePresident), updatePresidentName);

export default router;
