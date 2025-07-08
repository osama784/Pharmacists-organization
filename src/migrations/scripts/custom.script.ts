// @ts-ignore
import feeModel from "../../models/fee.model";

const custom = async () => {
    const result = await feeModel.find();
    for (const fee of result) {
        const t = await fee.updateOne({
            $rename: { detail: "details" },
        });
        console.log(t);
    }
    // let docs = await feeModel.find();
    // console.log(docs);
};

export default custom;
