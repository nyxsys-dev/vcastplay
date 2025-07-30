export interface Schedule {
    id: number;
    name: string;
    description: string;
    contents: ScheduleContentItem[];
    status: string;
    approvedInfo?: {
        approvedBy: string,
        approvedOn: Date | string | null,
        remarks: string,
    },
    createdOn: Date;
    updatedOn: Date;
}

export interface ScheduleContentItem {
    type: 'asset' | 'playlist' | 'layout';
    eventId: any;
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    allDay: boolean;
    duration?: number;
    isFiller?: boolean;
    extendedProps?: any; // contents details
}