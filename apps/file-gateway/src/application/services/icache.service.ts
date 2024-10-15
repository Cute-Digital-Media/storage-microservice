import { Result } from "libs/common/application/base";

export interface ICacheService {
    readCachedValue(key: string): Promise<Result<Buffer>>;

    writeCachedValue(key: string, obj: Buffer, exp: number): Promise<Result<any>>;

    invalidateCachedValue(key: string): Promise<Result<any>>;
}
