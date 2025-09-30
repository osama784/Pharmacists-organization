import { ParsedQs } from "qs";
export interface ILeaseQuery {
    page?: string;
    limit?: string;

    estatePlace?: ParsedQs | string;
    estateNum?: ParsedQs | string;
    pharmacistOwner?: ParsedQs | string;
    startDate?: ParsedQs | string;
    endDate?: ParsedQs | string;
    closedOut?: ParsedQs | string;
}

export const LeaseQueries: Record<keyof ILeaseQuery, "Date" | "string" | "number" | "boolean" | "custom"> = {
    page: "string",
    limit: "string",

    estatePlace: "string",
    estateNum: "number",
    startDate: "Date",
    endDate: "Date",
    closedOut: "boolean",
    pharmacistOwner: "custom",
};
