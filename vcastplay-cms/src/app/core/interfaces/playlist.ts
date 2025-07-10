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
    approvedInfo?: {
        approvedBy: string;
        approvedOn: Date | string | null;
        remarks: string;
    };
    createdOn: Date;
    updatedOn: Date;
}