export class CreateProductDto {
   name: string;
   price?: number;
   stock?: number;
   description?: string;
   image?: string;
   customFields?: Record<string, any>;
   ownerId: string;
}
