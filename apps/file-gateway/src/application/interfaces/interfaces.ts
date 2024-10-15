import { Provider } from "@nestjs/common";
import { FileRepository } from "../../infrastructure/repositories/file.repository";

export const ApplicationInterfaces: Provider[] = [
    {
        provide: "IFileRepository",
        useClass: FileRepository
    }
]