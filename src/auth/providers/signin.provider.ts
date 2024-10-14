import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../users/providers/users.service";
import { SignInDto } from "../dtos/signindto";
import { HashingProvider } from "./hashing.provider";
import { JwtService } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class SignInProvider {
    constructor(
        /**
         *Inject userService 
        */
        @Inject(forwardRef(() => UsersService))
        private readonly userServices: UsersService,

        /**
         * Inject hashingProvider
        */
        private readonly hashingProvider: HashingProvider,

        /**
         * Inject jwtService
         */

        private readonly jwtService: JwtService,

        /**
         * Injetc JwtConfiguration
         */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    ) { }

    public async signIn(signInDto: SignInDto) {
        //Find the User using Email ID        
        //Throw an exception user not found

        let user = await this.userServices.getUserByEmail(signInDto.email)

        // Compare password to the hash 
        let isEqual: boolean = false;
        try {
            isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password)
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not compare passwords"
            }
            )
        }
        if (!isEqual) {
            throw new UnauthorizedException("Incorrect Password")
        }


        const accessToke = await this.jwtService.signAsync({
            id: user.id,
            email: user.email,
            rol: user.rol,
            tenant: user.tenant

        },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl
            },)

        return accessToke


    }

}