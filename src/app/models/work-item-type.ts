import { modelUI } from "src/app/models/common.model";

export class WorkItemType {
    id: string;
    type: string;
    attributes?: {
        name: string;
        version: number;
        description: string;
        icon: string;
        fields: Map<string, WorkItemTypeField>;
    };
}

export class WorkItemTypeField {
    description?: string;
    label: string;
    required: boolean;
    type: {
        componentType?: string,
        baseType?: string,
        kind: string,
        values?: string[]
    };
}

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
}
