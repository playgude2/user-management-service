import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../src/common/cache/cache.service';
import {
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

const mockCreateQueryBuilder = {
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
};

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => mockCreateQueryBuilder),
});

const mockCacheService = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: CacheService, useFactory: mockCacheService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      const user = { id: 1, ...createUserDto };
      (userRepository.create as jest.Mock).mockReturnValue(user);
      (userRepository.save as jest.Mock).mockResolvedValue(user);

      expect(await userService.create(createUserDto)).toEqual(user);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      (userRepository.save as jest.Mock).mockRejectedValue({ code: '23505' });

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const createUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      (userRepository.save as jest.Mock).mockRejectedValue(new Error());

      await expect(userService.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          birthdate: new Date('1990-01-01'),
        },
      ];
      (cacheService.get as jest.Mock).mockResolvedValue(null);
      (userRepository.find as jest.Mock).mockResolvedValue(users);

      expect(await userService.findAll()).toEqual(users);
    });

    it('should return cached users', async () => {
      const users = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          birthdate: new Date('1990-01-01'),
        },
      ];
      (cacheService.get as jest.Mock).mockResolvedValue(users);

      expect(await userService.findAll()).toEqual(users);
    });

    it('should throw InternalServerErrorException for errors', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);
      (userRepository.find as jest.Mock).mockRejectedValue(new Error());

      await expect(userService.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const user = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      expect(await userService.findOne(1)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      (userRepository.findOne as jest.Mock).mockRejectedValue(new Error());

      await expect(userService.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const user = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      const updateUserDto = { name: 'Jane', surname: 'Doe' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...user,
        ...updateUserDto,
      });

      expect(await userService.update(1, updateUserDto)).toEqual({
        ...user,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto = { name: 'Jane', surname: 'Doe' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const user = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      expect(await userService.remove(1)).toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
