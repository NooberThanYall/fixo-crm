import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';


export class SignUpDto {

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;


  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
  
  @IsString({ message: 'Phone number must be a string.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phone: string;

  
  @IsOptional()
  @IsString({ message: 'Full name must be a string if provided.' })
  fullName?: string;
   
  @IsOptional()
  @IsArray({ message: 'Fields must be an array of strings.' })
  @IsString({ each: true, message: 'Each field item must be a string.' })
  fields?: string[];
}