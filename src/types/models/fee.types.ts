import { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose";
import { SectionDocument } from "./section.types.js";

interface IFee {
    name: string;
    section: Types.ObjectId;
    details?: Map<string, number>;
    value?: number;
    isMutable: boolean;
    isRepeatable: boolean;
}

export type FeeDocument = HydratedDocument<IFee>;
export type PopulatedFeeDocument = Omit<FeeDocument, "section"> & {
    section: SectionDocument;
};

export interface IFeeModel extends Model<FeeDocument> {}

// more
export interface IDetailedPrints {
    "سجل الأدوية العادية/صيدليات": number;
    "سجل الأدوية النفسية/صيدليات": number;
    "سجل الأدوية المخدرة/صيدليات": number;
    "بطاقة الالتزام بالأسعار": number;
    "كشف صرفيات مخدرات": number;
    "حالات سريرية قيمة مطبوعات": number;
    "قانون المخدرات": number;
    "التراكيب الدوائية": number;
    "مجموعة الأنظمة والقوانين": number;
}
