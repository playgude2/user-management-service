import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UnblockUserDto {
  @ApiProperty({ description: 'ID of the user initiating the unblock' })
  @IsInt()
  blockerId: number;

  @ApiProperty({ description: 'ID of the user to be unblocked' })
  @IsInt()
  blockedId: number;
}
