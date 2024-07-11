import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import { CreateUserDto } from '../src/user/dtos/create-user.dto';
import { UpdateUserDto } from '../src/user/dtos/update-user.dto';
import { SearchUserDto } from '../src/user/dtos/search-user.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { User } from '../src/user/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      const result: User = {
        id: 1,
        ...createUserDto,
        blockedUsers: [],
      };
      jest.spyOn(userService, 'create').mockResolvedValue(result);

      expect(await userController.create(createUserDto)).toBe(result);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(userController.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException for invalid input', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
      };
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(userController.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          birthdate: new Date('1990-01-01'),
          blockedUsers: [],
        },
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result: User = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
        blockedUsers: [],
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      expect(await userController.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(userController.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Jane', surname: 'Doe' };
      const result: User = {
        id: 1,
        name: 'Jane',
        surname: 'Doe',
        username: 'johndoe',
        birthdate: new Date('1990-01-01'),
        blockedUsers: [],
      };
      jest.spyOn(userService, 'update').mockResolvedValue(result);

      expect(await userController.save(1, updateUserDto)).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Jane', surname: 'Doe' };
      jest
        .spyOn(userService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(userController.save(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid input', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Jane', surname: 'Doe' };
      jest
        .spyOn(userService, 'update')
        .mockRejectedValue(new BadRequestException());

      await expect(userController.save(1, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const result = { message: 'The user has been successfully deleted.' };
      jest.spyOn(userService, 'remove').mockResolvedValue();

      expect(await userController.remove(1)).toEqual(result);
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      const searchUserDto: SearchUserDto = { username: 'john' };
      const result: User[] = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          birthdate: new Date('1990-01-01'),
          blockedUsers: [],
        },
      ];
      jest.spyOn(userService, 'search').mockResolvedValue(result);

      expect(
        await userController.search(searchUserDto, { user: { id: 1 } } as any),
      ).toBe(result);
    });

    it('should throw BadRequestException for invalid query', async () => {
      const searchUserDto: SearchUserDto = { username: 'john' };
      jest
        .spyOn(userService, 'search')
        .mockRejectedValue(new BadRequestException());

      await expect(
        userController.search(searchUserDto, { user: { id: 1 } } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
