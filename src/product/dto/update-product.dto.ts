export class UpdateProductDto {
   id: string;
   name?: string;
   price?: number;
   stock?: number;
   description?: string;
   images: string[];
   customFields?: Record<string, any>;
}
