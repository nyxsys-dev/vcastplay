import { ApprovedInfo } from "./general";
import { Screen } from "./screen";

export interface DesignLayout {
    id: number;
    name: string;
    description: string;
    type: string;
    canvas: any;
    thumbnail: string | null;
    htmlLayers?: any;
    duration: number;
    color: string;
    status: string;
    approvedInfo?: ApprovedInfo;
    isActive: boolean;
    hasPlaylist: boolean;
    screen?: Screen;
    contentId?: any;
    files?: any[];
    createdOn: Date;
    updatedOn: Date;
}

export interface HtmlLayer {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    content: any;
    rotation: number;
    fabricObject: any;
}