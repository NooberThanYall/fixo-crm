import { Injectable } from '@nestjs/common';
import { AiCommandDto } from './dtos/ai-answer.dto';
import { ProductService } from 'src/product/product.service';
import { Task } from 'src/ai/ai.service';

@Injectable()
export class ExecutorService {
   constructor(
      private readonly productService: ProductService,
   ) { }

   async executeTask(userId: string, task: Task) {
      const { action, entity, data } = task;

      if (entity !== 'product') {
         throw new Error(`Unknown entity: ${entity}`);
      }

      switch (action) {
         case 'add':
            return this.productService.add(data, userId);

         case 'update':
            return this.productService.update(data.id, data);

         case 'get':
            return this.productService.get(data.id);

         case 'delete':
            return this.productService.delete(data.id);

         default:
            throw new Error(`Unknown action: ${action}`);
      }
   }
}
