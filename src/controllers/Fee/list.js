import Fee from "../../models/Fee.js";

const listFees = async (req, res, next) => {
    const queryStatus = req.query.status;
    let fees = [];
    try {
        if (queryStatus == "mutable") {
            fees = await Fee.find({ isMutable: true });
        } else if (queryStatus == "immutable") {
            fees = await Fee.find({ isMutable: false });
        } else {
            fees = await Fee.find();
        }
        res.json({
            success: true,
            data: fees,
        });
    } catch (e) {
        next(e);
    }
};

export default listFees;
