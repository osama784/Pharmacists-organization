import feeModel from "../../models/fee.model";
import sectionModel from "../../models/section.model";
import syndicateMembershipModel from "../../models/syndicateMembership.model";

const custom = async () => {
    await feeModel.deleteMany();
    await sectionModel.deleteMany();
    await syndicateMembershipModel.deleteMany();
};

export default custom;
