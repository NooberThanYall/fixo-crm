import { Injectable } from "@nestjs/common";
import { AiCommandDto } from "./dtos/ai-answer.dto";
import { ProductService } from "src/product/product.service";

@Injectable()
export class ExecutorService {
   constructor(
      private readonly productService: ProductService,
      // private readonly orderService: OrderService
   ) { }

   async executeTask(userId, task: AiCommandDto) {
      const { action, entity, data } = task;

      switch (entity) {
         case "product":
            switch (action) {
               case "add":
                  return this.productService.add(data);

               case "update":
                  return this.productService.update(userId, data);

               case "get":
                  return this.productService.get(data);

               case "delete":
                  return this.productService.delete(data);

               default:
                  throw new Error(`Unknown action: ${action}`);
            }

         case "order":
            switch (action) {
               case "add":
                  return this.orderService.add(data);
               case "update":
                  return this.orderService.update(data);
               case "get":
                  return this.orderService.get(data);
               case "delete":
                  return this.orderService.delete(data);
               default:
                  throw new Error(`Unknown action: ${action}`);
            }

         default:
            throw new Error(`Unknown entity: ${entity}`);
      }
   }

}