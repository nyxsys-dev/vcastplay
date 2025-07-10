import { Assets } from "./assets";
import { Playlist } from "./playlist";
import { Schedule } from "./schedules";

export interface Screen {
    id: number;
    code: string;
    name: string;
    type: 'desktop' | 'android' | 'web';
    address: {
        country: string;
        region: string;
        city: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
        zipCode: string;
    };
    group?: string;
    subGroup?: string;
    displaySettings: {
        orientation: string;
        resolution: string;
    }
    operation?: {
        alwaysOn: boolean;
        weekdays: string[];
        hours: string[];
    };
    geographic?: {
        location: string;
        landmark: string;
    };
    tags?: string[];
    status: 'active' | 'inactive';
    screenStatus?: 'playing' | 'standby' | 'disconnected';
    displayStatus?: 'on' | 'off';
    assignedContent?: {
        type: 'asset' | 'playlist' | 'schedule';
        content: Assets | Playlist | Schedule; // Design Layout
    }
    messages?: ScreenMessage[]; 
    response?: string;
    others?: any;
    screenshotOn?: Date;
    onlineOn?: Date;
    registeredOn?: Date;
    createdOn: Date;
    updatedOn: Date;
}

export interface ScreenMessage {
    id: number;
    name: string;
    category: string;
    icon: string;
    title: string;
    description: string;
    message: string;
    duration: number;
    isDisplayed: boolean;
    createdOn: Date;
    updatedOn: Date;
}