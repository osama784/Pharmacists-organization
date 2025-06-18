import Pharmacist from "../../models/Pharmacist.js";

const listPharmacists = async (req, res, next) => {
    try {
        let queries = req.query;
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 10;
        const skip = (page - 1) * limit;

        queries = Object.fromEntries(
            Object.entries(queries).filter(([key, value]) => {
                return Object.keys(Pharmacist.schema.paths).includes(key);
            })
        );

        const result = await Pharmacist.find(queries).skip(skip).limit(limit);

        const total = await Pharmacist.countDocuments();

        res.json({
            data: result,
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

export default listPharmacists;
