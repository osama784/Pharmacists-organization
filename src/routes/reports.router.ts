import { Router } from "express";
import passport from "passport";
import checkPermission from "../middlewares/checkPermission.middleware";
import permissions from "../utils/permissions";
import invoicesReport from "../controllers/Reports/invoicesReport.controller";
import exportExcelInvoicesReport from "../controllers/Reports/exportExcelInvoicesReports.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/invoices", checkPermission(permissions.getInvoicesReport), invoicesReport);
router.get("/invoices/export", checkPermission(permissions.getInvoicesReport), exportExcelInvoicesReport);

export default router;
