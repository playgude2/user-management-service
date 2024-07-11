import {
  Controller,
  Post,
  Delete,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockService } from './block.service';
import { BlockUserDto } from './dtos/block-user.dto';
import { UnblockUserDto } from './dtos/unblock-user.dto';

@ApiTags('block')
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully blocked.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data. Please check the request body and try again.',
  })
  @ApiResponse({
    status: 404,
    description:
      'User not found. Please check the resource identifier and try again.',
  })
  async block(@Body() blockUserDto: BlockUserDto) {
    try {
      const result = await this.blockService.block(blockUserDto);
      return { message: 'The user has been successfully blocked.', result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Block error:', error);
      throw new BadRequestException(
        'Invalid input data. Please check the request body and try again.',
      );
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully unblocked.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data. Please check the request body and try again.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Block record not found. Please check the resource identifier and try again.',
  })
  async unblock(@Body() unblockUserDto: UnblockUserDto) {
    try {
      await this.blockService.unblock(unblockUserDto);
      return { message: 'The user has been successfully unblocked.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Unblock error:', error);
      throw new BadRequestException(
        'Invalid input data. Please check the request body and try again.',
      );
    }
  }
}
