import Pharmacist from "../../models/Pharmacist.js";

const searchPharmacists = async (req, res, next) => {
    const queryKey = req.query.filter;
    const queryValue = req.query.value;
    const allowedFilters = ["fullName", "ministerialNumber"];
    if (!(queryKey in allowedFilters)) {
        res.status(400).json({ message: "you send a filter that doesn't match any pharmacist field" });
        return;
    }
    const pharmacists = await Pharmacist.find({ [queryKey]: queryValue }).limit(10);

    if (!pharmacists) {
        res.sendStatus(404);
        return;
    }

    res.status(200).json(pharmacists);
    return;
};

export default searchPharmacists;
