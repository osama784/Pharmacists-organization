import { z } from "zod";
import { StringSchema } from "../utils/customSchemas";
import { BankModelTR } from "../translation/models.ar";
import { SECTIONS } from "../models/section.model";
import { responseMessages } from "../translation/response.ar";

const BankSchema = z.object({
    name: StringSchema({ keyName: BankModelTR.name }),
    accounts: z
        .array(
            z
                .object({
                    section: StringSchema({ keyName: BankModelTR.accounts.section }),
                    accountNum: StringSchema({ keyName: BankModelTR.accounts.accountNum }),
                })
                .refine(
                    (value) => {
                        if (!Object.values(SECTIONS).includes(value.section)) {
                            return false;
                        }
                        return true;
                    },
                    { message: responseMessages.BANK_CONTROLLERS.SECTION_NOT_FOUND }
                )
        )
        .refine(
            (data) => {
                if (data.length != Object.values(SECTIONS).length) return false;

                return true;
            },
            { message: responseMessages.BANK_CONTROLLERS.INCOMPLETE_SECTION_INFO }
        ),
});

export const BankCreateSchema = BankSchema;
export const BankUpdateSchema = BankSchema.partial();
