import * as z from 'zod';

const EntityEnum = z.enum(['product']);

const ActionEnum = z.enum(['add', 'update', 'get', 'delete']);

const DataSchema = z.record(z.any(), z.any());


const ProductQuerySchema = z.object({
      id: z.string().uuid().optional(),
      name: z.string().optional(),
      price: z.number().optional(),
      stock: z.number().optional(),
      description: z.string().optional(),
      customFields: z.record(z.any(), z.any()).optional(),
});


export const AIResponseSchema = z.object({
   entity: EntityEnum,
   action: ActionEnum,
   data: DataSchema,
   queries: ProductQuerySchema,
   error: z.string().optional()
});
