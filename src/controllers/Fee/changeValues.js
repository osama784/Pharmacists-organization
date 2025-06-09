import Fee from "../../models/Fee";

const changeFeesValues = async (req, res, next) => {
    let result = [];
    try {
        req.validatedData.forEach(async (fee) => {
            const fee = await Fee.findById(fee.id);
            if (!fee) {
                res.status(404);
                return;
            }
            if (fee.isMutable) {
                if (!req.validatedData.detail) {
                    res.status(400).json({ message: "please send detail object if the fee is mutable" });
                    return;
                }
                fee.detail = req.validatedData.detail;
                fee.save();
                result.push(fee);
            } else {
                if (!req.validatedData.value) {
                    res.status(400).json({ message: "please send value number if the fee is immutable" });
                    return;
                }
                fee.value = req.validatedData.value;
                fee.save();
                result.push(fee);
            }
        });
    } catch (e) {
        next(e);
    }
};

export default changeFeesValues;
