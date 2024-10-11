
export interface ICountAndTotalFile {
    count: number;
    files: any[];
}

export interface IFile {
    id: string;
    url: string;
    size: number;
    uploadedAt: Date;
    uploadedBy?: string;
    isActive?: boolean;
    thumbnails: string[];
}

export interface IThumbnail {
    id: string;
    url: string;
    type: string;
}
