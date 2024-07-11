import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SearchUserDto } from './dtos/search-user.dto';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.cacheService.del('allUsers');
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this username already exists.');
      }
      throw new InternalServerErrorException(
        'Failed to create user. Please try again later.',
      );
    }
  }

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.cacheService.get('allUsers');
    if (cachedUsers) {
      return cachedUsers;
    }

    try {
      const users = await this.usersRepository.find();
      await this.cacheService.set('allUsers', users, 600); // cache for 10 minutes
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve users. Please try again later.',
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user. Please try again later.',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = Object.assign(user, updateUserDto);
    await this.cacheService.del('allUsers');
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    await this.cacheService.del('allUsers');
  }

  async search(searchUserDto: SearchUserDto, userId: number): Promise<User[]> {
    try {
      const query = this.usersRepository.createQueryBuilder('user');

      // Exclude users that are blocked by the current user
      const blockingUser = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['blockedUsers'],
      });

      if (!blockingUser) {
        throw new NotFoundException('User not found.');
      }

      const blockedUserIds = blockingUser.blockedUsers.map((user) => user.id);

      if (searchUserDto.username) {
        query.andWhere('user.username LIKE :username', {
          username: `%${searchUserDto.username}%`,
        });
      }

      if (searchUserDto.minAge) {
        query.andWhere('user.birthdate <= :minDate', {
          minDate: new Date(
            new Date().setFullYear(
              new Date().getFullYear() - searchUserDto.minAge,
            ),
          ),
        });
      }

      if (searchUserDto.maxAge) {
        query.andWhere('user.birthdate >= :maxDate', {
          maxDate: new Date(
            new Date().setFullYear(
              new Date().getFullYear() - searchUserDto.maxAge,
            ),
          ),
        });
      }

      if (blockedUserIds.length > 0) {
        query.andWhere('user.id NOT IN (:...blockedUserIds)', {
          blockedUserIds,
        });
      }

      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Invalid query parameters. Please check the query and try again.',
      );
    }
  }
}
