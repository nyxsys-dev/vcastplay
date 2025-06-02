export interface Assets {
    id: number;
    code: string;
    name: string;
    type: string;
    file: string;
    category: string;
    subCategory: string;
    fileDetails: {
        orientation: string;
        resolution: string;
        size: string;
        type: string;
    };
    audienceTag: string;
    availability: string;
    dateRange: {
        start: string;
        end: string;
    };
    hours: string[];
}