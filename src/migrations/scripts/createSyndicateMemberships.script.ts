import SyndicateMemberShip from "../../models/syndicateMembership.model";
import Fee from "../../models/fee.model";
import syndicateMemberships from "../data/syndicateMemberships.json";

const createSyndicateMembership = async () => {
    await syndicateMemberships.forEach(async (obj) => {
        const fees = obj.fees.map(async (fee) => {
            const doc = await Fee.findOne({ name: fee });
            if (!doc) {
                throw new Error(`fee with name ${fee} not found`);
            }
            return doc._id;
        });

        const feeIds = await Promise.all(fees);
        const fee = await SyndicateMemberShip.create({
            name: obj.name,
            fees: feeIds,
        });
        console.log(fee);
    });
};

export default createSyndicateMembership;
