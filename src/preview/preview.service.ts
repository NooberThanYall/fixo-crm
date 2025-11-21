import { Injectable } from '@nestjs/common';
import { Task } from 'src/ai/ai.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

class Preview { constructor(before: Product, after: Product) { } }



@Injectable()
export class PreviewService {

    private task: Task;

    constructor(
        private readonly productService: ProductService,
    ) { }

    setTask(task: Task) {
        this.task = task;
    }
    async givePreview() {


    }
    async previewUpdate(userId: string, task: Task) {
        const { queries, data } = task;

        
        const products = await this.productService.findByQuery(userId, queries);

        if (!products.length) {
            return { preview: [], message: "No product matched your query." };
        }

        
        const preview = products.map(product => {
            const before = product;

            const after = {
                ...product,
                ...data,
            };

            return { before, after };
        });

        return { preview };
    }

    async previewAdd(): Promise<Partial<Product>> {
        const product = new Product();
        Object.assign(product, this.task.data);

        return product;
    }

}
