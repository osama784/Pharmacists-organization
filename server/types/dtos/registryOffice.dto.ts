import { RegistryOfficePrintsTypesEnum, SignerEnum } from "../../utils/templatesUtils/registryOfficeTemplate";

export type PrintRegistryOfficeDocument = {
    pharmacist: string;
    documentType: RegistryOfficePrintsTypesEnum;
    signer: SignerEnum;
    additionalContent?: string;
    travelPlace?: string;
    travelReason?: string;
    registered?: boolean;
};
