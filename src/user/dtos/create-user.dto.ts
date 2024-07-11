import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'John' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Doe' })
  surname: string;

  @IsString()
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @IsDateString()
  @ApiProperty({ example: '1990-01-01' })
  birthdate: Date;
}
