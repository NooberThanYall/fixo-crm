import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async add(data: CreateProductDto) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id:string, data: UpdateProductDto) {
    const existing = await this.productRepo.findOne({ where: { id: id } });
    if (!existing) throw new Error('Product not found');
    const merged = { ...existing, ...data };
    return this.productRepo.save(merged);
  }

  async get(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.productRepo.delete(id);
  }

  async listByUser(userId: string) {
    return this.productRepo.find({ where: { owner: { id: userId } } });
  }
}
