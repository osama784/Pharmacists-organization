import { FeeDocument, PopulatedFeeDocument } from "../models/fee.types";
import { SectionDocument } from "../models/section.types";

export interface IUpdateFeesValuesDto {
    id: string;
    details?: Record<string, any>;
    value?: number;
}

export type FeeResponseDto = {
    id: string;
    name: string;
    section: SectionDocument;
    details?: Map<string, number>;
    value?: number;
    isMutable: boolean;
    isRepeatable: boolean;
};

export function toFeeResponseDto(data: PopulatedFeeDocument): FeeResponseDto;
export function toFeeResponseDto(data: PopulatedFeeDocument[]): FeeResponseDto[];

export function toFeeResponseDto(data: PopulatedFeeDocument | PopulatedFeeDocument[]): FeeResponseDto | FeeResponseDto[] {
    if (Array.isArray(data)) {
        const result: FeeResponseDto[] = [];
        for (const doc of data) {
            result.push(_toFeeResponseDto(doc));
        }
        return result;
    } else {
        return _toFeeResponseDto(data);
    }
}

function _toFeeResponseDto(doc: PopulatedFeeDocument): FeeResponseDto {
    return {
        id: doc.id,
        name: doc.name,
        section: doc.section,
        details: doc.details,
        value: doc.value,
        isMutable: doc.isMutable,
        isRepeatable: doc.isRepeatable,
    };
}
