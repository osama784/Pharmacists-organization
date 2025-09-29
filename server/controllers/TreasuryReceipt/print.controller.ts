import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryReceiptResponseDto, TreasuryReceiptResponseDto } from "../../types/dtos/treasuryReceipt.dto";
import { responseMessages } from "../../translation/response.ar";
import TreasuryReceipt from "../../models/treasuryReceipt.model";
import { PharmacistDocument } from "../../types/models/pharmacist.types";
import fs from "fs/promises";
import path from "path";
import { PROJECT_DIR } from "../../utils/images";
import { dateUtils } from "../../utils/dateUtils";
import { TreasuryReceiptTemplate } from "../../utils/templatesUtils/treasuryReceiptTemplate";
import puppeteer from "puppeteer-core";
import getChromePath from "../../utils/getChromePath";
import { Gender } from "../../enums/pharmacist.enums";

const printTreasuryReceipt = async (req: Request, res: TypedResponse<undefined>, next: NextFunction) => {
    try {
        const receiptID = req.params.id;
        const receipt = await TreasuryReceipt.findOne({ serialID: receiptID }).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        if (!receipt) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let receiptHTML = await fs.readFile(path.join(path.join(PROJECT_DIR, "templates", "treasury-receipt.html")), {
            encoding: "utf-8",
        });
        receiptHTML = receiptHTML.replace("{{createdAt}}", dateUtils.formatDate(new Date()));
        receiptHTML = receiptHTML.replace(
            `<div class="to-section"></div>`,
            `<div class="to-section">
                إلى ${receipt.pharmacist.gender == Gender.MALE ? "السيد" : "الآنسة"} ${receipt.pharmacist.fullName} ${
                receipt.pharmacist.gender == Gender.MALE ? "المحترم" : "المحترمة"
            }
            </div>`
        );
        receiptHTML = receiptHTML.replace("{{receiptID}}", receipt.serialID);
        receiptHTML = TreasuryReceiptTemplate.appendReceiptFeesTable(receiptHTML, receipt);

        const browser = await puppeteer.launch({
            executablePath: getChromePath(), // Function to get Chrome path
            headless: true, // Run in headless mode
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for server environments
        });

        const page = await browser.newPage();
        await page.setContent(receiptHTML, { waitUntil: "networkidle0" });
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
        res.setHeader("Content-Disposition", 'attachment; filename="receipt.pdf"');

        // Send the PDF
        res.send(pdfBuffer);
    } catch (e) {
        next(e);
    }
};

export default printTreasuryReceipt;
