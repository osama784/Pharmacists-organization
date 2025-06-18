import Invoice from "../../models/Invoice.js";
import Section from "../../models/Section.js";
import loadJSONFile from "../../utils/loadJsonFile.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createInvoice = async (req, res, next) => {
    try {
        // check fines date, adding fines
        const fees = req.validatedData.fees;
        const DATA_PATH = path.resolve(__dirname, "../..", "config", "static-data.json");
        const staticData = await loadJSONFile(DATA_PATH);
        const finesDate = new Date(staticData["fines Date"]);

        const sections = await Section.find().populate("fineableFees fineSummaryFee");
        let fineSummaryFeeValue = 0;
        let currentFee = null;
        let isFinesIncluded = false;
        if (new Date() >= finesDate) {
            isFinesIncluded = true;
            sections.forEach((section) => {
                section.fineableFees.forEach((fee) => {
                    currentFee = fees.filter((obj) => obj.feeRef == fee._id)[0];
                    fineSummaryFeeValue += (currentFee.value * 25) / 100;
                });
                fees.push({
                    feeRef: section.fineSummaryFee._id,
                    feeName: section.fineSummaryFee.name,
                    sectionName: section.name,
                    value: fineSummaryFeeValue,
                });
                fineSummaryFeeValue = 0;
            });
        } else {
            sections.forEach((section) => {
                fees.push({
                    feeRef: section.fineSummaryFee._id,
                    feeName: section.fineSummaryFee.name,
                    sectionName: section.name,
                    value: 0,
                });
            });
        }

        const invoice = await Invoice.create({ ...req.validatedData, fees, isFinesIncluded });
        res.json(invoice);
    } catch (e) {
        next(e);
    }
};

export default createInvoice;
