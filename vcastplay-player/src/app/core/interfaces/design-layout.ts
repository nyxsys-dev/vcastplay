
export interface DesignLayout {
    id: number;
    name: string;
    description: string;
    type: string;
    canvas: any;
    thumbnail: string | null;
    htmlLayers?: any;
    duration: number;
    color: string;
    status: string;
    isActive: boolean;
    hasPlaylist: boolean;
    screen?: Screen;
    contentId?: any;
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