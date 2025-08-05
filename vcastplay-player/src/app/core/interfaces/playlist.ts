export interface Playlist {
    id: number;
    name: string;
    link: string;
    type: 'image' | 'audio' | 'text' | 'video' | 'web';
    duration: number;
}
