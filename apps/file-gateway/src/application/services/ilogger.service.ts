import { Injectable, Logger } from "@nestjs/common";

export interface ILoggerService 
{
    info(message: string | any); 
    error(message: string | any); 
    warn(message: string | any); 
}


// Basic implementation for now, later maybe extend it with Seq or other external logging service 
@Injectable()
export class LoggerService extends Logger implements ILoggerService
{
    constructor() {
        super("FileGateWay");
    }
    info(message: string | any){
        return this.log(message); 
    }
}
