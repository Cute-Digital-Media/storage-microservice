export class LogoutProvider {

    blacklistedTokens: Set<string> = new Set();

    public async addToken(token: string) {
        await this.blacklistedTokens.add(token);
    }

    public async isTokenBlacklisted(token: string): Promise<boolean> {
        return await this.blacklistedTokens.has(token);
    }

}