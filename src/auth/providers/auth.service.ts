import { Injectable } from "@nestjs/common";
import { SignInDto } from "../dtos/signindto";
import { SignInProvider } from "./signin.provider";
import { LogoutProvider } from "./logout.provider";



@Injectable()
export class AuthService {
    constructor(
        /**
         * Inject sigInProvider
         */
        private readonly signInProvider: SignInProvider,
        private readonly logOutProvider: LogoutProvider,
    ) { }
    public async signIng(signInDto: SignInDto) {
        return await this.signInProvider.signIn(signInDto)
    }

    public async logOut(token: string) {
        return await this.logOutProvider.addToken(token)
    }
}

