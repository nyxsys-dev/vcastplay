export interface SelectOption {
    label: string,
    value: string
}

export interface AudienceTag {
    name: string,
    demographic: {
        ageGroup: string,
        gender: string,
    },
    temporal: {
        timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Late Night',
        seasonality: 'Spring' | 'Summer' | 'Fall' | 'Winter'
    },
    geographic: {
        location: string,
        pointOfIntereset: string
    }
}