import { Assets } from "./assets";

export interface Playlist {
    id: number;
    name: string;
    description: string;
    transition: {
        hasGap: boolean;
        type: string;
        speed: number;
    },
    contents: Assets[];
    loop: boolean;
    status: string;
    createdOn: Date;
    updatedOn: Date;
}