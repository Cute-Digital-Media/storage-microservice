
import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HashingProvider } from '../../auth/providers/hashing.provider';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,
    ) { }

    public async createUser(createUserDto: CreateUserDto) {
        let existingUser = undefined;
        try {
            // Check is user exists with same email
            existingUser = await this.userRepository.findOneBy({
                email: createUserDto.email
            })
        } catch (error) {
            // Might save the details of the exception
            // Information which is sensitive
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                    description: 'Error connecting to the database',
                },
            );
        }
        // Handle exception
        if (existingUser) {
            throw new BadRequestException(
                'The user already exists, please check your email.',
            );

        }
        // Create a new user
        let newUser = this.userRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password)
        })
        try {
            newUser = await this.userRepository.save(newUser);
        } catch (error) {
            console.error('Error saving user:', error);
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                    description: 'Error saving user' + error,
                },
            );
        }
        return newUser;
    }

    public async getUsers() {
        let users: User[] | undefined = undefined;
        users = await this.userRepository.find()
        return users
    }
    public async deleteUser(deleteUserDto: DeleteUserDto) {
        let existingUser: User | undefined = undefined

        existingUser = await this.userRepository.findOneBy({
            email: deleteUserDto.email
        })

        let isEqual: boolean = false
        if (existingUser) {
            try {
                isEqual = await this.hashingProvider.comparePassword(deleteUserDto.password, existingUser.password)
            } catch (error) {
                throw new RequestTimeoutException(error, {
                    description: "Could not compare passwords"
                }
                )
            }
            if (isEqual) {
                await this.userRepository.delete(existingUser.id)
            } else {
                throw new UnauthorizedException("Incorrect Password")
            }
        }
        return (true)
    }

    public async updateUser(updateUserDto: UpdateUserDto) {
        let user: User | undefined = undefined;

        try {
            user = await this.userRepository.findOneBy({
                id: updateUserDto.id
            })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not fetch the user"
            })
        }
        if (!user) {
            throw new UnauthorizedException('User does no exists')
        }

        if (updateUserDto.email) {
            let sameEmail: boolean
            if (await this.userRepository.findOneBy({
                email: updateUserDto.email
            })) {
                sameEmail = true
            }
            if (sameEmail) {
                throw new BadRequestException("Este email ya se encuentra en uso ")
            }
        }
        if (updateUserDto.password) {
            user.password = await this.hashingProvider.hashPassword(updateUserDto.password)
        }
        //Update
        user.email = updateUserDto.email ?? user.email
        user.rol = updateUserDto.rol ?? user.rol
        user.tenant = updateUserDto.tenant ?? user.tenant
        try {
            await this.userRepository.save(user)
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                    description: 'Error al actualizar',
                },
            );
        }
        return user
    }
    public async getUserByEmail(email: string) {
        let user: User | undefined = undefined;

        try {
            //Buscando en la BD el email
            user = await this.userRepository.findOneBy({
                email: email
            })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not fect the user"
            })
        }
        // Check if user in not empty
        if (!user) {
            throw new UnauthorizedException('User does no exists')
        }

        return user;

    }

    public async getById(id: number) {
        return await this.userRepository.findOneBy({ id: id })
    }
}
