import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @IsString()
  @ApiProperty({ example: 'John' })
  name: string;

  @Column()
  @IsString()
  @ApiProperty({ example: 'Doe' })
  surname: string;

  @Column({ unique: true })
  @IsString()
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @Column()
  @IsDateString()
  @ApiProperty({ example: '1990-01-01' })
  birthdate: Date;

  @ManyToMany(() => User, (user) => user.blockedUsers)
  @JoinTable({
    name: 'user_blocks',
    joinColumn: { name: 'blockerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'blockedId', referencedColumnName: 'id' },
  })
  blockedUsers: User[];
}
