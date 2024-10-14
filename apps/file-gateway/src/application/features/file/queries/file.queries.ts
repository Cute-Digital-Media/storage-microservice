import {  GetAllFilesQueryHandler } from "./get-all/file.get-all.query";
import { GetOneFileQueryHandler } from "./get-one/file.get-one.query";

export const FileQueries = [
    GetOneFileQueryHandler,
    GetAllFilesQueryHandler
]