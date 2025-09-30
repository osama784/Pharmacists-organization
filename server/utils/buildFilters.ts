const allowedStringOperators = ["$regex"];
const allowedDateOperators = ["$gt", "$lt", "$gte", "$lte"];
const allowedNumberOperators = ["$gt", "$lt", "$gte", "$lte"];
import { ParsedQs } from "qs";

export const buildFilter = (queryParam: ParsedQs | string | undefined, type: "Date" | "string" | "number" | "boolean" | "custom") => {
    switch (type) {
        case "string":
            return buildStringFilter(queryParam);
        case "number":
            return buildNumberFilter(queryParam);
        case "boolean":
            return buildBooleanFilter(queryParam);
        case "Date":
            return buildDateFilter(queryParam);
        case "custom":
            return undefined;
    }
};

export const buildStringFilter = (queryParam: any) => {
    if (typeof queryParam == "string") {
        return queryParam;
    } else if (typeof queryParam == "object") {
        for (const key in queryParam) {
            if (typeof queryParam[key] == "object" || !allowedStringOperators.includes(key)) {
                return undefined;
            }
        }
        return { $regex: `.*${queryParam.$regex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`, $options: "i" };
    }
    return undefined;
};

export const buildDateFilter = (queryParam: any) => {
    if (typeof queryParam == "string" && !isNaN(Date.parse(queryParam))) {
        return queryParam;
    } else if (typeof queryParam == "object") {
        for (const key in queryParam) {
            if (typeof queryParam[key] == "object" || isNaN(Date.parse(queryParam[key])) || !allowedDateOperators.includes(key)) {
                return undefined;
            }
            if (key == "$lte") {
                const date = new Date(queryParam[key]!);
                date.setDate(date.getDate() + 1);
                queryParam[key] = date;
            }
        }
        return queryParam;
    }
    return undefined;
};

export const buildNumberFilter = (queryParam: any) => {
    if (typeof queryParam == "string" && !isNaN(parseInt(queryParam))) {
        return queryParam;
    } else if (typeof queryParam == "object") {
        for (const key in queryParam) {
            if (typeof queryParam[key] == "object" || !allowedNumberOperators.includes(key)) {
                return undefined;
            }
        }
        return queryParam;
    }
    return undefined;
};

export const buildBooleanFilter = (queryParam: any) => {
    if (typeof queryParam != "string" || (queryParam != "true" && queryParam != "false")) {
        return undefined;
    }
    return queryParam == "true" ? true : false;
};
