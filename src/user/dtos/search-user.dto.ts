import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'johndoe', required: false })
  username?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 18, required: false })
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Max(120)
  @ApiProperty({ example: 60, required: false })
  maxAge?: number;
}
