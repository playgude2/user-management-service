import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { User } from '../user/user.entity';
import { BlockUserDto } from './dtos/block-user.dto';
import { UnblockUserDto } from './dtos/unblock-user.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async block(blockUserDto: BlockUserDto) {
    const { blockerId, blockedId } = blockUserDto;
    const blocker = await this.userRepository.findOne({
      where: { id: blockerId },
      relations: ['blockedUsers'],
    });
    const blocked = await this.userRepository.findOne({
      where: { id: blockedId },
    });

    if (!blocker) {
      throw new NotFoundException('Blocker not found.');
    }
    if (!blocked) {
      throw new NotFoundException('Blocked user not found.');
    }

    blocker.blockedUsers.push(blocked);
    await this.userRepository.save(blocker);
    return blocker;
  }

  async unblock(unblockUserDto: UnblockUserDto) {
    const { blockerId, blockedId } = unblockUserDto;
    const blocker = await this.userRepository.findOne({
      where: { id: blockerId },
      relations: ['blockedUsers'],
    });
    const blocked = await this.userRepository.findOne({
      where: { id: blockedId },
    });

    if (!blocker) {
      throw new NotFoundException('Blocker not found.');
    }
    if (!blocked) {
      throw new NotFoundException('Blocked user not found.');
    }

    blocker.blockedUsers = blocker.blockedUsers.filter(
      (user) => user.id !== blocked.id,
    );
    await this.userRepository.save(blocker);
    return blocker;
  }
}
