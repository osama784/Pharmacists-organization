import { Schema, z } from "zod";
import { BooleanSchema, EnumSchema, mongooseIDSchema, StringSchema } from "../utils/customSchemas";
import { RegistryOfficePrintsTypes, SignerTypes } from "../utils/templatesUtils/registryOfficeTemplate";
import { RegistryOfficeTR } from "../translation/models.ar";

export const RegistryOfficePrintDocumentSchema = z.object({
    pharmacist: mongooseIDSchema({ keyName: RegistryOfficeTR.pharmacist }),
    signer: EnumSchema({
        keyName: RegistryOfficeTR.signer,
        data: SignerTypes as [string, ...[string]],
    }),
    documentType: EnumSchema({ keyName: RegistryOfficeTR.documentType, data: RegistryOfficePrintsTypes as [string, ...[string]] }),
    additionalContent: StringSchema({ keyName: RegistryOfficeTR.additionalContent, optional: true }),
    travelPlace: StringSchema({ keyName: RegistryOfficeTR.travelPlace, optional: true }),
    travelReason: StringSchema({ keyName: RegistryOfficeTR.travelReason, optional: true }),
    registered: BooleanSchema({ keyName: RegistryOfficeTR.registered, optional: true }),
});
