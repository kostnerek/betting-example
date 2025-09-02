import { MaxLength, MinLength } from 'class-validator';

export class UserAuthDto {
  @MinLength(3)
  @MaxLength(20)
  username: string;
}
