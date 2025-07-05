import { IPharmacist } from "../models/pharmacist.types.js";

export type createPharmacistDto = Omit<IPharmacist, "invoices">;
export type updatePharmacistDto = Partial<Omit<IPharmacist, "invoices">>;
