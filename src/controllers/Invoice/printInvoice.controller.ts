import { NextFunction, Request, TypedResponse } from "express";
import fs from "fs/promises";
import path from "path";
import Section from "../../models/section.model";
import { FeeDocument } from "../../types/models/fee.types";
import Invoice from "../../models/invoice.model";
import { responseMessages } from "../../translation/response.ar";
import toLocalDate from "../../utils/toLocalDate";
import { PharmacistDocument } from "../../types/models/pharmacist.types";

const printInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        let invoiceHTML = await fs.readFile(path.join(path.join(__dirname, "..", "..", "..", "invoice.html")), {
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
        invoiceHTML = invoiceHTML.replace("{{pharmacist_name}}", `${invoice.pharmacist.fullName}`);
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
        res.send(invoiceHTML);
    } catch (e) {
        console.log(e);
    }
};

export default printInvoice;
