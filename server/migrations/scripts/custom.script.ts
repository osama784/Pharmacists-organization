import feeModel from "../../models/fee.model";
import pharmacistModel from "../../models/pharmacist.model";
import sectionModel from "../../models/section.model";
import syndicateMembershipModel from "../../models/syndicateMembership.model";
import crypto from "crypto";

const custom = async () => {
    const pharmacists = await pharmacistModel.find();
    for (const doc of pharmacists) {
        doc.folderToken = crypto.randomBytes(32).toString("hex");
        await doc.save();
    }
    const result = await pharmacistModel.find();
    console.log(result);
};

export default custom;
