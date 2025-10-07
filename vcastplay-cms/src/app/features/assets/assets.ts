import { AudienceTag } from "../../core/interfaces/general";

export interface Assets {
    id: number;
    code: string;
    name: string;
    type: string;
    link: string;
    category?: string;
    subCategory?: string;
    thumbnail?: string
    fileDetails: AssestInfo;
    dateRange?: { 
        start: Date | null;
        end: Date | null;
    };
    hours?: string[];
    weekdays?: string[];
    duration: number;
    audienceTag: AudienceTag;
    status: string;
    contentId?: any;
    createdOn: Date;
    updatedOn: Date;
}

export interface AssetType {
    label: string;
    value: string;
}

export interface AssestInfo {
    name: string;
    type: string;
    size: number;
    orientation: string;
    resolution: { width: number; height: number };
}