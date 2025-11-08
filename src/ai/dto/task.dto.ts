import { IsNotEmpty } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class TaskDTO{
   @IsNotEmpty()
   prompt: string
}