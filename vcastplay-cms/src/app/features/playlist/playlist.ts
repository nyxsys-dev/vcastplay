import { signal } from "@angular/core";
import { ApprovedInfo } from "../../core/interfaces/general";

export interface Playlist {
    id: number;
    name: string;
    description: string;
    type: string;
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
    files?: any[];
    createdOn: Date;
    updatedOn: Date;
}

export interface ContentState {
    index: number;
    currentContent: ReturnType<typeof signal<any>>;
    isPlaying: ReturnType<typeof signal<boolean>>;
    progress: ReturnType<typeof signal<number>>;
    fadeIn: ReturnType<typeof signal<boolean>>;
    currentTransition: ReturnType<typeof signal<any>>;
    timeoutId?: any;
    intervalId?: any;
    gapTimeout?: any;
}