import { NextFunction, Request, TypedResponse } from "express";
import fs from "fs/promises";
import path from "path";
import Section from "../../models/section.model";
import { FeeDocument } from "../../types/models/fee.types";
import Invoice from "../../models/invoice.model";
import { responseMessages } from "../../translation/response.ar";
import toLocalDate from "../../utils/toLocalDate";
import { PharmacistDocument } from "../../types/models/pharmacist.types";
import puppeteer from "puppeteer-core";

const printInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        let invoiceHTML = await fs.readFile(path.join(path.join(__dirname, "..", "..", "..", "templates", "invoice.html")), {
            encoding: "utf-8",
        });

        invoiceHTML = invoiceHTML.replace(
            "{{createdAt}}",
            `${invoice.createdAt.getFullYear()}/${invoice.createdAt.getMonth()}/${invoice.createdAt.getDate()}`
        );
        invoiceHTML = invoiceHTML.replace(
            "{{createdAt}}",
            `${invoice.createdAt.getFullYear()}/${invoice.createdAt.getMonth()}/${invoice.createdAt.getDate()}`
        );
        invoiceHTML = invoiceHTML.replace(
            "{{birthDate}}",
            `${invoice.pharmacist.birthDate.getFullYear()}/${invoice.pharmacist.birthDate.getMonth()}/${invoice.pharmacist.birthDate.getDate()}`
        );
        invoiceHTML = invoiceHTML.replace("{{birthPlace}}", `${invoice.pharmacist.birthPlace}`);
        invoiceHTML = invoiceHTML.replace("{{fatherName}}", `${invoice.pharmacist.fatherName}`);
        invoiceHTML = invoiceHTML.replace("{{motherName}}", `${invoice.pharmacist.motherName}`);
        invoiceHTML = invoiceHTML.replace("{{lastName}}", `${invoice.pharmacist.motherName}`);
        invoiceHTML = invoiceHTML.replace("{{lastName}}", `${invoice.pharmacist.lastName}`);
        invoiceHTML = invoiceHTML.replace("{{gender}}", `${invoice.pharmacist.gender}`);

        invoiceHTML = invoiceHTML.replace("{{employee_name}}", `${req.user?.username}`);
        invoiceHTML = invoiceHTML.replace("{{employee_name}}", `${req.user?.username}`);
        if (invoice.pharmacist.lastTimePaid) {
            invoiceHTML = invoiceHTML.replace(
                "{{lastTimePaid}}",
                `${invoice.pharmacist.lastTimePaid.getFullYear()}/${invoice.pharmacist.lastTimePaid.getMonth()}/${invoice.pharmacist.lastTimePaid.getDate()}`
            );
        }
        invoiceHTML = invoiceHTML.replace("{{syndicateMembership}}", `${invoice.syndicateMembership}`);
        invoiceHTML = invoiceHTML.replace("{{syndicateMembership}}", `${invoice.syndicateMembership}`);
        invoiceHTML = invoiceHTML.replace("{{fullName}}", `${invoice.pharmacist.fullName}`);
        invoiceHTML = invoiceHTML.replace("{{fullName}}", `${invoice.pharmacist.fullName}`);

        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");
        let feeOrder = 1;
        let total = 0;
        for (const section of sections) {
            feeOrder = 1;
            total = 0;
            for (const fee of section.fees) {
                const invoiceFee = invoice.fees.find((value) => value.name == fee.name);
                const searchFeeName = `<th class="table-header" data-section="${section.name}" data-number="${feeOrder}"></th>`;
                const resultFeeName = `<th class="table-header" data-section="${section.name}" data-number="${feeOrder}">${fee.name}</th>`;

                const searchFeeValue = `<td class="center-align" data-section="${section.name}" data-value="true" data-number="${feeOrder}"></td>`;
                const resultFeeValue = `<td class="center-align" data-section="${
                    section.name
                }" data-value="true" data-number="${feeOrder}">${invoiceFee?.value!}</td>`;

                feeOrder++;
                total += invoiceFee?.value!;
                invoiceHTML = invoiceHTML.replace(searchFeeName, resultFeeName);
                invoiceHTML = invoiceHTML.replace(searchFeeValue, resultFeeValue);
            }
            const searchTotal = `<td class="center-align" data-section="${section.name}" data-final="true"></td>`;
            const resultTotal = `<td class="center-align" data-section="${section.name}" data-final="true">${total}</td>`;

            invoiceHTML = invoiceHTML.replace(searchTotal, resultTotal);
        }

        const browser = await puppeteer.launch({
            executablePath: getChromePath(), // Function to get Chrome path
            headless: true, // Run in headless mode
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for server environments
        });

        const page = await browser.newPage();
        await page.setContent(invoiceHTML, { waitUntil: "networkidle0" });
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
        res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');

        // Send the PDF
        res.send(pdfBuffer);
        // res.send(invoiceHTML);
    } catch (e) {
        next(e);
    }
};

export default printInvoice;

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
