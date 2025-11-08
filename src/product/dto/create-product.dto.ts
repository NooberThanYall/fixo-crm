export class CreateProductDto {
   name: string;
   price?: number;
   stock?: number;
   description?: string;
   imageUrl?: string;
   customFields?: Record<string, any>;
   ownerId: string;
}
