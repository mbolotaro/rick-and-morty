import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SignUpDto {
  @IsString() @Length(1, 100) firstName!: string;
  @IsString() @Length(1, 100) lastName!: string;
  @IsEmail() email!: string;
  @IsString()
  @Length(8, 72)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'A senha deve conter maiúscula, minúscula e número.',
  })
  password!: string;
}
export class SignInDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

export class MobileRefreshDto {
  @IsString()
  refreshToken!: string;
}
