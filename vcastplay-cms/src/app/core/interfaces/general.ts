export interface SelectOption {
    label: string;
    value: any;
}

export interface AudienceTag {
    genders: string[];
    ageGroups: string[];
    timeOfDays: string[];
    seasonalities: string[];
    locations: string[];
    pointOfInterests: string[];
    tags: string[];
}

export interface Availability {
    selected: boolean;
    weekday: string;
    hour: string;
}

export const WEEKDAYS: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ApprovedInfo {
    approvedBy: string;
    approvedOn: Date | string | null;
    remarks: string;
}