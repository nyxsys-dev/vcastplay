export interface Screen {
    id: number;
    code: string;
    name: string;
    type: string;
    displaySettings: {
        orientation: string;
        resolution: string;
    }
    group: string;
    subGroup: string;
    layout: string;
    status: 'online' | 'offline';
    geolocation: { latitude: number; longitude: number };
    schedule: {
        operation: any;
        hours: any;
    };
    geographicalLocation: {
        location: string;
        landmark: string;
    };
    caltonDatxSerialNo: string;
    createdOn: Date;
    updatedOn: Date;
}