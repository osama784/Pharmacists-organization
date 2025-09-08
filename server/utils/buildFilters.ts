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
            if (key == "$lte") {
                const date = new Date(value[key]);
                date.setDate(date.getDate() + 1);
                value[key] = date;
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

export const buildBooleanFilter = (value: string) => {
    if (typeof value != "string" || (value != "true" && value != "false")) {
        return undefined;
    }
    return value == "true" ? true : false;
};
