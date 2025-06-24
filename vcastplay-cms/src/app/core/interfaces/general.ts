export interface SelectOption {
    label: string;
    value: string;
}

export interface AudienceTag {
    gender: string[];
    ageGroup: string[];
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