import Fee from "../../models/Fee.js";

const updateFeesValues = async (req, res, next) => {
    let result = [];
    try {
        for (const feeObject of req.validatedData) {
            if (!feeObject.detail && !feeObject.value) {
                res.status(400).json({ message: 'please send "detail" object if the fee is mutable, otherwise send "value" number' });
                return;
            }
            const fee = await Fee.findById(feeObject.id);
            if (!fee) {
                res.sendStatus(404);
                return;
            }
            if (fee.isMutable) {
                if (!feeObject.detail) {
                    res.status(400).json({ message: 'please send "detail" object if the fee is mutable' });
                    return;
                }
                await fee.updateOne({
                    $set: {
                        detail: feeObject.detail,
                    },
                });
                const doc = await Fee.findById(fee._id);
                result.push(doc);
            } else {
                if (!feeObject.value) {
                    res.status(400).json({ message: 'please send "value" number if the fee is immutable' });
                    return;
                }
                await fee.updateOne({
                    $set: {
                        value: feeObject.value,
                    },
                });
                const doc = await Fee.findById(fee._id);
                result.push(doc);
            }
        }
        // req.validatedData.forEach(async (feeObject) => {

        // });
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export default updateFeesValues;
