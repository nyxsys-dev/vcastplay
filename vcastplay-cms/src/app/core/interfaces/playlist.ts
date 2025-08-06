import { ApprovedInfo } from "./general";

export interface Playlist {
    id: number;
    name: string;
    description: string;
    transition: {
        hasGap: boolean;
        type: string;
        speed: number;
    },
    contents: any[];
    loop: boolean;
    status: string;
    duration?: number;
    isAuto: boolean;
    isActive: boolean;
    approvedInfo?: ApprovedInfo;
    createdOn: Date;
    updatedOn: Date;
}