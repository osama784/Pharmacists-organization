import { FeeDocument, PopulatedFeeDocument } from "../models/fee.types";
import { SectionDocument } from "../models/section.types";

export interface IUpdateFeesValuesDto {
    id: string;
    details?: Record<string, any>;
    value?: number;
}

export type FeeResponseDto =
    | {
          id: string;
          name: string;
          section: string;
          isMutable: true;
          details: Map<string, number>;
      }
    | {
          id: string;
          name: string;
          section: string;
          isMutable: false;
          value: number;
      };

export function toFeeResponseDto(data: FeeDocument): FeeResponseDto;
export function toFeeResponseDto(data: FeeDocument[]): FeeResponseDto[];

export function toFeeResponseDto(data: FeeDocument | FeeDocument[]): FeeResponseDto | FeeResponseDto[] {
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

function _toFeeResponseDto(doc: FeeDocument): FeeResponseDto {
    if (doc.isMutable) {
        return {
            id: doc.id,
            name: doc.name,
            section: doc.section.toString(),
            details: doc.details!,
            isMutable: doc.isMutable,
        };
    }
    return {
        id: doc.id,
        name: doc.name,
        section: doc.section.toString(),
        value: doc.value!,
        isMutable: doc.isMutable,
    };
}
