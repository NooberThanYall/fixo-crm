import { Injectable } from '@nestjs/common';
import { Task } from 'src/ai/ai.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

export interface PreviewResult {
    preview: any[];
    message?: string;
}

@Injectable()
export class PreviewService {

    private task: Task;

    constructor(
        private readonly productService: ProductService,
    ) { }

    setTask(task: Task) {
        this.task = task;
        return this; // chaining
    }

    async preview(userId: string): Promise<PreviewResult> {
        switch (this.task.action) {

            case 'add':
                return this.previewAdd();

            case 'update':
                return this.previewUpdate(userId);

            case 'delete':
                return this.previewDelete(userId);

            case 'get':
                return this.previewGet(userId);

            default:
                return {
                    preview: [],
                    message: `Unknown action: ${this.task.action}`
                };
        }
    }

    // -----------------------------
    //  PREVIEW: ADD
    // -----------------------------
    async previewAdd(): Promise<PreviewResult> {
        const product = new Product();
        Object.assign(product, this.task.data);

        return {
            preview: [{ before: null, after: product }]
        };
    }

    // -----------------------------
    //  PREVIEW: UPDATE
    // -----------------------------
    async previewUpdate(userId: string): Promise<PreviewResult> {
        const { queries, data } = this.task;

        const products = await this.productService.findByQuery(userId, queries);

        if (!products.length) {
            return {
                preview: [],
                message: "No product matched your query."
            };
        }

        const preview = products.map(p => ({
            before: p,
            after: { ...p, ...data }
        }));

        return { preview };
    }

    // -----------------------------
    //  PREVIEW: DELETE
    // -----------------------------
    async previewDelete(userId: string): Promise<PreviewResult> {
        const { queries } = this.task;

        const products = await this.productService.findByQuery(userId, queries);

        if (!products.length) {
            return {
                preview: [],
                message: "No product matched your query."
            };
        }

        // nothing gets modified — only shown
        const preview = products.map(p => ({
            before: p,
            after: null
        }));

        return { preview };
    }

    // -----------------------------
    //  PREVIEW: GET
    // -----------------------------
    async previewGet(userId: string): Promise<PreviewResult> {
        const { queries } = this.task;

        const products = await this.productService.findByQuery(userId, queries);

        return {
            preview: products
        };
    }
}
