import { NextFunction, Request, TypedResponse } from "express";
import fs from "fs/promises";
import path from "path";
import { fillMainContent, fillSignutreContent, RegistryOfficePrintsTypesEnum } from "../../utils/templatesUtils/registryOfficeTemplate";
import Pharmacist from "../../models/pharmacist.model";
import { responseMessages } from "../../translation/response.ar";
import { PrintRegistryOfficeDocument } from "../../types/dtos/registryOffice.dto";
import puppeteer from "puppeteer-core";

const printDocuments = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const validatedData: PrintRegistryOfficeDocument = req.validatedData;
        let registryOfficeHTML = await fs.readFile(
            path.join(path.join(__dirname, "..", "..", "..", "templates", "registry-office-base.html")),
            {
                encoding: "utf-8",
            }
        );

        const pharmacist = await Pharmacist.findById(validatedData.pharmacist);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        registryOfficeHTML = registryOfficeHTML.replace(
            `<div class="main-content"></div>`,
            `<div class="main-content">
            ${fillMainContent(validatedData.documentType, { ...validatedData, pharmacist: pharmacist })}
            </div>
            `
        );
        registryOfficeHTML = registryOfficeHTML.replace(`<div class="signature-section"></div>`, fillSignutreContent(validatedData.signer));
        const browser = await puppeteer.launch({
            executablePath: getChromePath(), // Function to get Chrome path
            headless: true, // Run in headless mode
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for server environments
        });

        const page = await browser.newPage();
        await page.setContent(registryOfficeHTML, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                // bottom: "20px",
                left: "20px",
            },
        });

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="document.pdf"');

        // Send the PDF
        res.send(pdfBuffer);
        // res.send(registryOfficeHTML);
    } catch (e) {
        next(e);
    }
};

export default printDocuments;

function getChromePath() {
    const platform = process.platform;

    if (platform === "win32") {
        // Common Windows paths for Chrome
        return (
            [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            ].find((path) => require("fs").existsSync(path)) || undefined
        );
    } else if (platform === "darwin") {
        // macOS path
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
        // Linux path
        return "/usr/bin/google-chrome";
    }
}
