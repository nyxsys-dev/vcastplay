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
    others?: any;
    registeredOn?: Date;
    createdOn: Date;
    updatedOn: Date;
}