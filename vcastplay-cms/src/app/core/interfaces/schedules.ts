export interface Schedule {
    id: number;
    name: string;
    description: string;
    contents: ScheduleContentItem[];
    status: string;
    approvedInfo?: {
        approvedBy: string,
        approvedOn: Date | null,
        remarks: string,
    },
    createdOn: Date;
    updatedOn: Date;
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