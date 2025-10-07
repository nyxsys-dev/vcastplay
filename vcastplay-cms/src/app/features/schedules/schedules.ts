import { ApprovedInfo } from "../../core/interfaces/general";


export interface Schedule {
    id: number;
    name: string;
    description: string;
    contents: ScheduleContentItem[];
    status: string;
    approvedInfo?: ApprovedInfo;
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