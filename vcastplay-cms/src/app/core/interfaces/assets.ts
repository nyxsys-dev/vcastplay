export interface Assets {
    id: number;
    code: string;
    name: string;
    type: string;
    link: string;
    file: string;
    category: string;
    subCategory: string;
    fileDetails: {
        orientation: string;
        resolution: string;
        size: string;
        type: string;
    };
    audienceTag?: string;
    availability: string;
    dateRange: {
        start: string;
        end: string;
    };
    hours: string[];
}

export interface AssetType {
    label: string;
    value: string;
}

export interface AssestInfo {
    name: string,
    type: string,
    size: number,
    orientation: string,
    resolution: { width: number, height: number },
}