import { ParsedQs } from "qs";
export interface ILeaseQuery {
    page?: string;
    limit?: string;

    name?: ParsedQs;
    estatePlace?: ParsedQs;
    estateNum?: ParsedQs;
    pharmacistOwner?: ParsedQs;
    startDate?: ParsedQs;
    endDate?: ParsedQs;
    closedOut?: ParsedQs;
}

export const LeaseQueries: Record<keyof ILeaseQuery, "Date" | "string" | "number" | "boolean" | "custom"> = {
    page: "string",
    limit: "string",

    name: "string",
    estatePlace: "string",
    estateNum: "number",
    startDate: "Date",
    endDate: "Date",
    closedOut: "boolean",
    pharmacistOwner: "custom",
};
