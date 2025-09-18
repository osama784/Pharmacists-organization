import { CompleteData } from "./completeData";

export const createPharmacistData = (override: {}) => {
    return {
        ...CompleteData,
        ...override,
    };
};
