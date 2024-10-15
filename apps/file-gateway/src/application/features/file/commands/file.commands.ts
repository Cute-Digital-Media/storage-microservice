import { CreateFileCommandHandler } from "./create/file.create.command";
import { DeleteFileCommandHandler } from "./delete/file.delete.command";

export const FileCommandHandlers = [
    CreateFileCommandHandler, 
    DeleteFileCommandHandler
]