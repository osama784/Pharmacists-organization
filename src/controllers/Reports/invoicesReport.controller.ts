import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";
import Section from "../../models/section.model";
import Invoice from "../../models/invoice.model";
import { FeeDocument } from "../../types/models/fee.types";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto";

const invoicesReport = async (req: Request, res: TypedResponse<InvoiceResponseDto[]>, next: NextFunction) => {
    try {
        const { section, startDate, endDate } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        if (!section || !startDate || !endDate) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.MISSING_VALUES] });
            return;
        }
        if (
            typeof startDate != "string" ||
            typeof endDate != "string" ||
            typeof section != "string" ||
            isNaN(Date.parse(startDate)) ||
            isNaN(Date.parse(endDate))
        ) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.BAD_VALUES] });
            return;
        }
        const sectionDoc = await Section.findOne({ name: section }).populate<{ fees: FeeDocument[] }>("fees");
        if (!sectionDoc) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.SECTION_NOT_FOUND] });
            return;
        }
        const startDateParsed = new Date(startDate);
        const endDateParsed = new Date(endDate);
        const filter = { createdAt: { $gt: startDateParsed, $lt: endDateParsed } };
        const invoices = await Invoice.find(filter).skip(skip).limit(limit);

        const result: InvoiceResponseDto[] = [];
        for (const invoice of invoices) {
            const fees = invoice.fees.filter((fee) => {
                const exist = sectionDoc.fees.findIndex((element) => element.name == fee.name);
                return exist ? true : false;
            });
            result.push({ ...toInvoiceResponseDto(invoice), fees: fees });
        }

        const totalItems = await Invoice.find(filter).skip(skip).limit(limit).countDocuments();
        res.json({
            success: true,
            data: result,
            meta: {
                totalItems: totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default invoicesReport;
