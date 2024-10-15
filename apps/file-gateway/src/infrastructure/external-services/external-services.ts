import { Provider } from "@nestjs/common";
import { FireBaseStorageService } from "./firebase-storage.service";
import { RedisCacheService } from "./redis-cache.service";

export const ExternalServicesProviders: Provider[] = [
    {
        provide: "IFileStorageService", 
        useClass: FireBaseStorageService
    },
    {
        provide: "ICacheService", 
        useClass: RedisCacheService
    }
] 