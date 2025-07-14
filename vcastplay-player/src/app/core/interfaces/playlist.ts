export interface Playlist {
    id: number;
    link: string;
    type: 'image' | 'audio' | 'text' | 'video' | 'web';
    duration: number;
}
