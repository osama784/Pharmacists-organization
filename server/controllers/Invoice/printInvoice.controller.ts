import { NextFunction, Request, TypedResponse } from "express";
import fs from "fs/promises";
import path from "path";
import Section, { SECTIONS } from "../../models/section.model";
import { FeeDocument } from "../../types/models/fee.types";
import Invoice from "../../models/invoice.model";
import { responseMessages } from "../../translation/response.ar";
import { PharmacistDocument } from "../../types/models/pharmacist.types";
import puppeteer from "puppeteer-core";
import { BankDocument } from "../../types/models/bank.types";

const printInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const invoice = await Invoice.findOne({ serialID: req.params.id }).populate<{ pharmacist: PharmacistDocument; bank: BankDocument }>(
            "pharmacist bank"
        );
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        let invoiceHTML = await fs.readFile(path.join(path.join(__dirname, "..", "..", "..", "templates", "invoice.html")), {
            encoding: "utf-8",
        });
        invoiceHTML = invoiceHTML.replace("{{bank}}", invoice.bank.name);
        invoiceHTML = invoiceHTML.replace("{{syndicate_account}}", invoice.bank.getAccount(SECTIONS.SYNDICATE).accountNum);
        invoiceHTML = invoiceHTML.replace("{{retirement_account}}", invoice.bank.getAccount(SECTIONS.RETIREMENT).accountNum);
        invoiceHTML = invoiceHTML.replace("{{disability_account}}", invoice.bank.getAccount(SECTIONS.DISABILITY).accountNum);
        invoiceHTML = invoiceHTML.replace("{{health_account}}", invoice.bank.getAccount(SECTIONS.HEALTH).accountNum);

        invoiceHTML = invoiceHTML.replace("{{invoiceID}}", invoice.serialID);
        invoiceHTML = invoiceHTML.replace("{{status}}", invoice.status);

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
        if (invoice.pharmacist.birthPlace) {
            invoiceHTML = invoiceHTML.replace("{{birthPlace}}", `${invoice.pharmacist.birthPlace}`);
        } else {
            invoiceHTML = invoiceHTML.replace("{{birthPlace}}", "لا يوجد");
        }

        invoiceHTML = invoiceHTML.replace("{{fatherName}}", `${invoice.pharmacist.fatherName}`);
        invoiceHTML = invoiceHTML.replace("{{motherName}}", `${invoice.pharmacist.motherName}`);
        invoiceHTML = invoiceHTML.replace("{{lastName}}", `${invoice.pharmacist.lastName}`);
        invoiceHTML = invoiceHTML.replace("{{gender}}", `${invoice.pharmacist.gender}`);

        invoiceHTML = invoiceHTML.replace("{{employee_name}}", `${req.user?.username}`);
        invoiceHTML = invoiceHTML.replace("{{employee_name}}", `${req.user?.username}`);
        if (invoice.pharmacist.lastTimePaid) {
            invoiceHTML = invoiceHTML.replace(
                "{{lastTimePaid}}",
                `${invoice.pharmacist.lastTimePaid.getFullYear()}/${invoice.pharmacist.lastTimePaid.getMonth()}/${invoice.pharmacist.lastTimePaid.getDate()}`
            );
        } else {
            invoiceHTML = invoiceHTML.replace("{{lastTimePaid}}", "لا يوجد");
        }
        invoiceHTML = invoiceHTML.replace("{{syndicateMembership}}", `${invoice.syndicateMembership}`);
        invoiceHTML = invoiceHTML.replace("{{syndicateMembership}}", `${invoice.syndicateMembership}`);
        invoiceHTML = invoiceHTML.replace("{{firstName}}", `${invoice.pharmacist.firstName}`);
        invoiceHTML = invoiceHTML.replace("{{fullName}}", `${invoice.pharmacist.fullName}`);

        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");
        let feeOrder = 1;
        let sectionTotal = 0;
        let total = 0;
        for (const section of sections) {
            feeOrder = 1;
            sectionTotal = 0;
            for (const fee of section.fees) {
                const invoiceFee = invoice.fees.find((value) => value.name == fee.name);
                const searchFeeName = `<th class="table-header" data-section="${section.name}" data-number="${feeOrder}"></th>`;
                const resultFeeName = `<th class="table-header" data-section="${section.name}" data-number="${feeOrder}">${fee.name}</th>`;

                const searchFeeValue = `<td class="center-align" data-section="${section.name}" data-value="true" data-number="${feeOrder}"></td>`;
                const resultFeeValue = `<td class="center-align" data-section="${
                    section.name
                }" data-value="true" data-number="${feeOrder}">${invoiceFee?.value!}</td>`;

                feeOrder++;
                sectionTotal += invoiceFee?.value!;
                invoiceHTML = invoiceHTML.replace(searchFeeName, resultFeeName);
                invoiceHTML = invoiceHTML.replace(searchFeeValue, resultFeeValue);
            }
            total += sectionTotal;
            const searchSectionTotal = `<td class="center-align" data-section="${section.name}" data-final="true"></td>`;
            const resultSectionTotal = `<td class="center-align" data-section="${section.name}" data-final="true">${sectionTotal}</td>`;

            const searchSectionTotal2 = `<td class="center-align" data-section="${section.name}" data-section-total="true"></td>`;
            const resultSectionTotal2 = `<td class="center-align" data-section="${section.name}" data-section-total="true">${sectionTotal}</td>`;

            invoiceHTML = invoiceHTML.replace(searchSectionTotal, resultSectionTotal);
            invoiceHTML = invoiceHTML.replace(searchSectionTotal2, resultSectionTotal2);
        }
        const searchTotal = `<td class="center-align" data-total-all-sections="true"></td>`;
        const resultTotal = `<td class="center-align" data-total-all-sections="true">${total}</td>`;
        invoiceHTML = invoiceHTML.replace(searchTotal, resultTotal);

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
