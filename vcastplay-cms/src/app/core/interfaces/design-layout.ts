import { ApprovedInfo } from "./general";
import { Screen } from "./screen";

export interface DesignLayout {
    id: number;
    name: string;
    description: string;
    canvas: any;
    htmlLayers?: any;
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
    content: string;
    rotation: number;
    fabricObject: any;
}