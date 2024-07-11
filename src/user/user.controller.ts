import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SearchUserDto } from './dtos/search-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CustomRequest } from '../middlewares/jwt.middleware'; // Adjust the import path accordingly
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'User with this email or username already exists.',
        );
      }
      throw new BadRequestException(
        'Invalid input data. Please check the request body and try again.',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal server error. Please try again later.',
      );
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by username and/or age range' })
  @ApiResponse({ status: 200, description: 'Return search results.' })
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'Search by username',
  })
  @ApiQuery({ name: 'minAge', required: false, description: 'Minimum age' })
  @ApiQuery({ name: 'maxAge', required: false, description: 'Maximum age' })
  async search(
    @Query() searchUserDto: SearchUserDto,
    @Req() req: CustomRequest,
  ) {
    try {
      const userId = req.user?.id; // Extract user ID from JWT token
      return await this.userService.search(searchUserDto, userId);
    } catch (error) {
      throw new BadRequestException(
        'Invalid query parameters. Please check the query and try again.',
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Internal server error. Please try again later.',
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  async save(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Update error:', error);
      throw new BadRequestException(
        'Invalid input data. Please check the request body and try again.',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  async remove(@Param('id') id: number) {
    try {
      await this.userService.remove(id);
      return { message: 'The user has been successfully deleted.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal server error. Please try again later.',
      );
    }
  }
}
