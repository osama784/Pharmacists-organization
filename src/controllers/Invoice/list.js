import Invoice from "../../models/Invoice";

const listInvoices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const results = await Invoice.find().skip(skip).limit(limit).select("-fees").populate("pharmacist");

        const total = await Invoice.countDocuments();

        res.json({
            data: results,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                itemsPerPage: limit,
            },
        });
        return;
    } catch (e) {
        next(e);
    }
};

export default listInvoices;
