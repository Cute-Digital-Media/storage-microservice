import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "../../application/interfaces/reposoitories/iuser-repository";
import { ILoggerService } from "../../application/services/ilogger.service";
import { UserEntity } from "../../domain/entities/user.entity";

@Injectable()
export class DbSeeder {
    constructor(
        @Inject("IUserRepository")
        private readonly userRepository: IUserRepository, 
        @Inject("ILoggerService")
        private readonly logger: ILoggerService 
    ) {}

    async seed() {
        await this.createTestingUser("670d1451-5974-8002-9288-aa476cb08e01", "user1@example.com");
        await this.createTestingUser("670d1451-5974-8002-9288-aa476cb08e02", "user2@example.com");
    }

    private async createTestingUser(userId: string, email: string) {
        const existingUser = await this.userRepository.findOneByFilter({
            where: {
                email: email
            }
        });

        if (existingUser) {
            this.logger.info(`User with email ${email} already exists.`);
            return;
        }
        const newUser = new UserEntity({email});
        newUser.id = userId; 
        await this.userRepository.saveNew(newUser);
        this.logger.info(`User ${email} created successfully.`);
    }
}
