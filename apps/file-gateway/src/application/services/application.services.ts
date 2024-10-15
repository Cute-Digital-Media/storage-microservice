import { Provider } from "@nestjs/common";
import { LoggerService } from "./ilogger.service";

export const ApplicationServices: Provider[] = [
    {
        provide: "ILoggerService", 
        useClass: LoggerService
    }
]; 