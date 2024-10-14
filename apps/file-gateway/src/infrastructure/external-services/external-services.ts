import { Provider } from "@nestjs/common";
import { FireBaseStorageService } from "./firebase-storage.service";

export const ExternalServicesProviders: Provider[] = [
    {
        provide: "IFileStorageService", 
        useClass: FireBaseStorageService
    }
] 