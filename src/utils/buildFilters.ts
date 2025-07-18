const allowedStringOperators = ["$regex"];
const allowedDateOperators = ["$gt", "$lt", "$gte", "$lte"];
const allowedNumberOperators = ["$gt", "$lt", "$gte", "$lte"];

export const buildStringFilter = (value: string | Record<string, any>) => {
    if (typeof value == "string") {
        return value;
    } else if (typeof value == "object") {
        for (const key in value) {
            if (typeof value[key] == "object" || !allowedStringOperators.includes(key)) {
                return undefined;
            }
        }
        return { $regex: `.*${value.$regex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`, $options: "i" };
    }
    return undefined;
};

export const buildDateFilter = (value: string | Record<string, any>) => {
    if (typeof value == "string" && !isNaN(Date.parse(value))) {
        return value;
    } else if (typeof value == "object") {
        for (const key in value) {
            if (typeof value[key] == "object" || isNaN(Date.parse(value[key])) || !allowedDateOperators.includes(key)) {
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
            if (typeof value[key] == "object" || !allowedNumberOperators.includes(key)) {
                return undefined;
            }
        }
        return value;
    }
    return undefined;
};
