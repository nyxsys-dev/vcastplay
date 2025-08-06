import { ApprovedInfo } from "./general";
import { Screen } from "./screen";

export interface DesignLayout {
    id: number;
    name: string;
    description: string;
    canvas: any;
    status: string;
    approvedInfo?: ApprovedInfo;
    createdOn: Date;
    updatedOn: Date;
    screen?: Screen;
}