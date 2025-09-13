import { Router } from "express";
import passport from "passport";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import invoicesReport from "../controllers/Reports/invoicesReport.controller";
import exportExcelInvoicesReport from "../controllers/Reports/exportExcelInvoicesReports.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/invoices", checkPermissions(permissions.getInvoicesReport), invoicesReport);
router.get("/invoices/export", checkPermissions(permissions.exportInvoicesReportAsExcel), exportExcelInvoicesReport);

export default router;
