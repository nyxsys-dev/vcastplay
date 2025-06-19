export interface Assets {
    id: number;
    code: string;
    name: string;
    type: string;
    link: string;
    category: string;
    subCategory: string;
    fileDetails: AssestInfo;
    audienceTag: string;
    dateRange: { 
        start: Date;
        end: Date;
    };
    hours: string[];
    weekdays: string[];
    duration: number;
    status: string;
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
    thumbnail?: string
}