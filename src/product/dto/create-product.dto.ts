export class CreateProductDto {
   name: string;
   price?: number;
   stock?: number;
   description?: string;
   images?: string[];
   customFields?: Record<string, any>;
   ownerId: string;
}
