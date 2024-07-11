import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from './block.entity';
import { User } from '../user/user.entity';
import { CustomCacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Block, User]), CustomCacheModule],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
