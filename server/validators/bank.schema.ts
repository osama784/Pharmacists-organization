import { z } from "zod";
import { EnumSchema, StringSchema } from "../utils/customSchemas";
import { BankModelTR } from "../translation/models.ar";
import { SectionsEnum } from "../models/section.model";
import { responseMessages } from "../translation/response.ar";

const BankSchema = z.object({
    name: StringSchema({ keyName: BankModelTR.name }),
    accounts: z
        .array(
            z.object({
                section: EnumSchema({ keyName: BankModelTR.accounts.section, data: Object.values(SectionsEnum) as [string, ...[string]] }),
                accountNum: StringSchema({ keyName: BankModelTR.accounts.accountNum }),
            })
        )
        .refine(
            (data) => {
                if (data.length != Object.values(SectionsEnum).length) return false;

                return true;
            },
            { message: responseMessages.BANK_CONTROLLERS.INCOMPLETE_SECTION_INFO }
        ),
});

export const BankCreateSchema = BankSchema;
export const BankUpdateSchema = BankSchema.partial();
