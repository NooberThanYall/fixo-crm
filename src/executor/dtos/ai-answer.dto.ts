import { IsString, IsNumber, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum AiActionType {
   ADD = 'add',
   UPDATE = 'update',
   DELETE = 'delete',
   GET = 'get',
}

export enum AiEntityType {
   PRODUCT = 'product',
   CATEGORY = 'category',
   ORDER = 'order',
   USER = 'user',
}

export class AiCommandDto {
   @IsEnum(AiActionType)
   action: AiActionType;

   @IsEnum(AiEntityType)
   entity: AiEntityType;

   @IsObject()
   data: Record<string, any>; 

   @IsOptional()
   @IsString()
   source?: string; //  'voice' | 'text' | 'image'
}
