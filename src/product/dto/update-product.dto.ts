export class UpdateProductDto {
   id: string;
   name?: string;
   price?: number;
   stock?: number;
   description?: string;
   imageUrl?: string;
   customFields?: Record<string, any>;
}
