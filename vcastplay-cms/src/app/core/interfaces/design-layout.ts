import { ApprovedInfo } from "./general";
import { Screen } from "./screen";

export interface DesignLayout {
    id: number;
    name: string;
    description: string;
    canvas: any;
    htmlLayers?: any;
    duration: number;
    status: string;
    approvedInfo?: ApprovedInfo;
    createdOn: Date;
    updatedOn: Date;
    screen?: Screen;
}

export interface HtmlLayer {
    id: number;
    left: number;
    top: number;
    width: number;
    height: number;
    content: any;
    rotation: number;
    fabricObject: any;
}