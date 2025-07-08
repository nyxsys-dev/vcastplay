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
    approvedInfo?: {
        approvedBy: string;
        approvedOn: Date;
        remarks: string;
    };
    createdOn: Date;
    updatedOn: Date;
}