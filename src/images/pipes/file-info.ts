export class FileInfo {
  originalName: string;
  originalSize: number;
  compressedSize?: number;
  buffer: Buffer;
}
