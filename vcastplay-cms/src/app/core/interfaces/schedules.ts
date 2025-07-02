export interface Schedule {
    id: number,
    name: string,
    description: string,
    contents: ScheduleContentItem[];
    status: string;
    createdOn: Date,
    updatedOn: Date
}

export interface ScheduleContentItem {
    type: 'asset' | 'playlist' | 'layout';
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    extendedProps: any;
    allDay: boolean;
}