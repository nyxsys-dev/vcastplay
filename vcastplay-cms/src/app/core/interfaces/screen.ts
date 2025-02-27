export interface Screen {
    id: number;
    name: string;
    resolution: string;
    layout: string;
    status: 'online' | 'offline';
    geolocation: { latitude: number; longitude: number };
}