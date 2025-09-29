import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema from "../../models/pharmacist.model";
import { responseMessages } from "../../translation/response.ar";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer-core";
import { pharmacistTamplate } from "../../utils/templatesUtils/pharmacistInfoTemplate";
import { dateUtils } from "../../utils/dateUtils";
import { PROJECT_DIR } from "../../utils/images";
import getChromePath from "../../utils/getChromePath";
import { LicenseDocument, PenaltyDocument, SyndicateRecordDocument, UniversityDegreeDocument } from "../../types/models/pharmacist.types";

const printPhramacist = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const pharmacist = await pharmacistSchema.findById(req.params.id).populate<{
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties"]);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let pharmacistHTML = await fs.readFile(path.join(path.join(PROJECT_DIR, "templates", "pharmacist.html")), {
            encoding: "utf-8",
        });
        const { universityDegrees, syndicateRecords, penalties, licenses, personalInfo } = req.query;
        pharmacistHTML = pharmacistHTML.replace("{{createdAt}}", dateUtils.formatDate(new Date()));
        pharmacistHTML = pharmacistHTML.replace("{{fullName}}", pharmacist.fullName);

        if (personalInfo == "true") {
            pharmacistHTML = pharmacistHTML.replace("{{firstName}}", pharmacist.firstName);
            pharmacistHTML = pharmacistHTML.replace("{{lastName}}", pharmacist.lastName);
            pharmacistHTML = pharmacistHTML.replace("{{fatherName}}", pharmacist.fatherName);
            pharmacistHTML = pharmacistHTML.replace("{{motherName}}", pharmacist.motherName);
            pharmacistHTML = pharmacistHTML.replace("{{birthDate}}", dateUtils.formatDate(pharmacist.birthDate));
            pharmacistHTML = pharmacistHTML.replace("{{birthPlace}}", pharmacist.birthPlace || "غير محدد");

            pharmacistHTML = pharmacistHTML.replace("{{gender}}", pharmacist.gender);
            pharmacistHTML = pharmacistHTML.replace("{{nationalNumber}}", pharmacist.nationalNumber);
            pharmacistHTML = pharmacistHTML.replace("{{phoneNumber}}", pharmacist.phoneNumber);
            pharmacistHTML = pharmacistHTML.replace("{{landlineNumber}}", pharmacist.landlineNumber || "غير محدد");
            pharmacistHTML = pharmacistHTML.replace("{{nationality}}", pharmacist.nationality);
            pharmacistHTML = pharmacistHTML.replace("{{address}}", pharmacist.address || "غير محدد");
            pharmacistHTML = pharmacistHTML.replace("{{ministerialNumber}}", pharmacist.ministerialNumber || "غير محدد");
            pharmacistHTML = pharmacistHTML.replace(
                "{{ministerialRegistrationDate}}",
                pharmacist.ministerialRegistrationDate ? dateUtils.formatDate(pharmacist.ministerialRegistrationDate) : "غير محدد"
            );
            pharmacistHTML = pharmacistHTML.replace("{{registrationNumber}}", pharmacist.registrationNumber);
            pharmacistHTML = pharmacistHTML.replace("{{registrationDate}}", dateUtils.formatDate(pharmacist.registrationDate));
            pharmacistHTML = pharmacistHTML.replace("{{integrity}}", pharmacist.integrity || "غير محدد");
            pharmacistHTML = pharmacistHTML.replace("{{register}}", pharmacist.register || "غير محدد");
            pharmacistHTML = pharmacistHTML.replace(
                "{{oathTakingDate}}",
                pharmacist.oathTakingDate ? dateUtils.formatDate(pharmacist.oathTakingDate) : "غير محدد"
            );
        } else {
            pharmacistHTML = pharmacistHTML.replace(
                `<div id="personal-info" class="card">`,
                `<div id="personal-info" style = "display: none;" class="card">`
            );
        }

        if (universityDegrees == "true") {
            pharmacistHTML = pharmacistTamplate.appendUniversityDegrees(pharmacist.universityDegrees, pharmacistHTML);
        } else {
            pharmacistHTML = pharmacistHTML.replace(
                `<div id="universityDegrees" class="card">`,
                `<div id="universityDegrees" style = "display: none;" class="card">`
            );
        }
        if (syndicateRecords == "true") {
            pharmacistHTML = pharmacistTamplate.appendSyndicateRecords(pharmacist.syndicateRecords, pharmacistHTML);
        } else {
            pharmacistHTML = pharmacistHTML.replace(
                `<div id="syndicateRecords" class="card">`,
                `<div id="syndicateRecords" style = "display: none;" class="card">`
            );
        }
        if (licenses == "true") {
            pharmacistHTML = pharmacistTamplate.appendLicenses(pharmacist.licenses, pharmacistHTML);
        } else {
            pharmacistHTML = pharmacistHTML.replace(
                `<div id="licenses" class="card">`,
                `<div id="licenses" style = "display: none;" class="card">`
            );
        }
        if (penalties == "true") {
            pharmacistHTML = pharmacistTamplate.appendPenalties(pharmacist.penalties, pharmacistHTML);
        } else {
            pharmacistHTML = pharmacistHTML.replace(
                `<div id="penalties" class="card">`,
                `<div id="penalties" style = "display: none;" class="card">`
            );
        }

        const browser = await puppeteer.launch({
            executablePath: getChromePath(), // Function to get Chrome path
            headless: true, // Run in headless mode
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for server environments
        });

        const page = await browser.newPage();
        await page.setContent(pharmacistHTML, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                left: "20px",
            },
        });

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="pharmacist.pdf"');

        // Send the PDF
        res.send(pdfBuffer);
    } catch (e) {
        next(e);
    }
};

export default printPhramacist;
