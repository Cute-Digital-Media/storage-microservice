import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/singnup.input';
import { Repository } from 'typeorm';

const mockUserRepositoryFactory = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  create: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  findOneByOrFail: jest.fn((entity) => entity),
}));
describe('UsersService', () => {
  let service: UsersService;

  let mockUserRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const mockSignedUpUser: SignupInput = {
        email: 'test@gmail.com',
        password: 'password',
        fullName: 'Test User',
      };

      await service.create(mockSignedUpUser);

      expect(mockUserRepository.save).toBeCalledWith({
        ...mockSignedUpUser,
        password: expect.any(String),
        tenantId: expect.any(String),
      });
    });

    it('should throw an error when the database have any error', async () => {
      const mockSignedUpUser: SignupInput = {
        email: 'asd@gmail.com',
        password: 'password',
        fullName: 'Test User',
      };

      mockUserRepository.create = jest.fn(() => {
        throw new Error();
      });

      try {
        await service.create(mockSignedUpUser);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@gmail.com';

      mockUserRepository.findOneBy = jest.fn().mockReturnValue(null);

      await service.findOneByEmail(email);

      expect(mockUserRepository.findOneByOrFail).toBeCalledWith({ email });
    });

    it('should throw an error when the user is not found', async () => {
      const email = 'asf@gmia.com';

      mockUserRepository.findOneByOrFail = jest.fn(() => {
        throw new Error();
      });

      try {
        await service.findOneByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('findOneById', () => {
    it('should find a user by id', async () => {
      const id = 'test-id';

      mockUserRepository.findOneBy = jest.fn().mockReturnValue(null);

      await service.findOneById(id);

      expect(mockUserRepository.findOneByOrFail).toBeCalledWith({ id });
    });

    it('should throw an error when the user is not found', async () => {
      const id = 'test-id';

      mockUserRepository.findOneByOrFail = jest.fn(() => {
        throw new Error();
      });

      try {
        await service.findOneById(id);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
