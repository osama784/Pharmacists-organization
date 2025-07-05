const allowedStringOperators = ["$regex"];
const allowedDateOperators = ["$gt", "$lt", "$gte", "$lte"];
const allowedNumberOperators = ["$gt", "$lt", "$gte", "$lte"];

export const buildStringFilter = (value: string | Record<string, any>) => {
    if (typeof value == "string") {
        return value;
    } else if (typeof value == "object") {
        for (const key in value) {
            if (typeof key == "object" || !(key in allowedStringOperators)) {
                return undefined;
            }
        }
        return { ...value, $options: "i" };
    }
    return undefined;
};

export const buildDateFilter = (value: string | Record<string, any>) => {
    if (typeof value == "string") {
        return value;
    } else if (typeof value == "object") {
        for (const key in value) {
            if (typeof key == "object" || !(key in allowedDateOperators)) {
                return undefined;
            }
        }
        return value;
    }
    return undefined;
};

export const buildNumberFilter = (value: string | Record<string, any>) => {
    if (typeof value == "string" && !isNaN(parseInt(value))) {
        return value;
    } else if (typeof value == "object") {
        for (const key in value) {
            if (typeof key == "object" || !(key in allowedNumberOperators)) {
                return undefined;
            }
        }
        return value;
    }
    return undefined;
};
