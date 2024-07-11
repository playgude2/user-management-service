import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class BlockUserDto {
  @ApiProperty({ description: 'ID of the user initiating the block' })
  @IsInt()
  blockerId: number;

  @ApiProperty({ description: 'ID of the user to be blocked' })
  @IsInt()
  blockedId: number;
}
