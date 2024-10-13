export enum EnvVars {
    MS_PORT = "MS_PORT",
    DB_HOST = "DB_HOST",
    DB_PORT = "DB_PORT",
    DB_USER_NAME = "DB_USER_NAME",
    DB_PASSWORD = "DB_PASSWORD",
}

export class EnvVarsAccessor {
    static getValue(name: string): string {
        const val = process.env[name];
        if (val) {
            return val;
        }
        throw new Error(`Missing env var with name: ${name}`); 
    }

    static get MS_PORT(): string {
        return EnvVarsAccessor.getValue(EnvVars.MS_PORT);
    }
    static get DB_HOST(): string {
        return EnvVarsAccessor.getValue(EnvVars.DB_HOST);
    }
    static get DB_PORT(): string {
        return EnvVarsAccessor.getValue(EnvVars.DB_PORT);
    }
    static get DB_USER_NAME(): string {
        return EnvVarsAccessor.getValue(EnvVars.DB_USER_NAME);
    }
    static get DB_PASSWORD(): string {
        return EnvVarsAccessor.getValue(EnvVars.DB_PASSWORD);
    }
}
