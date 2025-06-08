import Pharmacist from "../../models/Pharmacist";

const searchPharmacists = async (req, res, next) => {
    const queryKey = req.query.filter;
    const queryValue = req.query.value;
    const allowedFilters = ["fullName", "ministerialNumber"];
    if (!(queryKey in allowedFilters)) {
        res.status(404);
        return;
    }
    const pharmacists = await Pharmacist.find({ [queryKey]: queryValue }).limit(10);

    if (!pharmacists) {
        res.status(404);
        return;
    }

    res.status(200).json(pharmacists);
    return;
};

export default searchPharmacists;
