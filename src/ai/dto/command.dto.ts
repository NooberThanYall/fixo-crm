import { IsNotEmpty, IsString } from "class-validator";

export class AiCommandDto{
   @IsNotEmpty()
   @IsString()
   command: string
}