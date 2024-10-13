import { Payload } from "src/_shared/domain/request-user";
import { UploadImageDto } from "src/images/domain/upload-image.dto";

export interface IImageJobData {
  file: Express.Multer.File;
  dto: UploadImageDto;
  payload: Payload
}