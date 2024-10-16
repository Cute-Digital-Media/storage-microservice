export class Image {
  id: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string | null;
  thumbnailFileName?: string | null;
  mimeType: string;
  size: number;
  uploaderByUserId?: string | null;

  constructor(data: Partial<Image>) {
    Object.assign(this, data);
  }
}
