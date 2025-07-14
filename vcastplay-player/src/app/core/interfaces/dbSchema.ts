import { Playlist } from "./playlist";

export interface DBSchema {
    items: {
        key: number;
        value: Playlist
    }
}