import { Buffer } from 'buffer';

export class FileModel {

  constructor(
    public file: Buffer,
    public fileName: string,
    public contentType: string,
  ) {
  }
}
