import {  GetAllFilesQueryHandler } from "./get-all/file.get-all.query";
import { GetOneFileQueryHandler } from "./get-one/file.get-one.query";
import { GetThumbnailQueryHandler } from "./get-thumbnail/file.get-thumbnail.query";

export const FileQueries = [
    GetOneFileQueryHandler,
    GetAllFilesQueryHandler,
    GetThumbnailQueryHandler
]