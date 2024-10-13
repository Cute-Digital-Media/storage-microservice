import { Payload } from "src/_shared/domain/request-user";
import { UploadImageDto } from "src/images/domain/upload-image.dto";

export interface ImageJobData {
  file: Express.Multer.File;
  dto: UploadImageDto;
  payload: Payload
}