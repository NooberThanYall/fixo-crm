import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async importFromExcel(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const baseFields = ['name', 'price', 'stock'];
    const headerRow = sheet.getRow(1).values as string[];

    const imported: Product[] = [];

    sheet.eachRow((row, index) => {
      if (index === 1) return; // skip header row

      const rowValues = row.values as any[];
      const rowObj: Record<string, any> = {};

      headerRow.forEach((header: string, i: number) => {
        if (!header) return;
        rowObj[header.toString().trim()] = rowValues[i];
      });

      const product = new Product();

      for (const key in rowObj) {
        if (baseFields.includes(key)) (product as any)[key] = rowObj[key];
        else {
          if (!product.customFields) product.customFields = {};
          product.customFields[key] = rowObj[key];
        }
      }

      imported.push(product);
    });

    await this.productRepo.save(imported);

    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted uploaded file: ${filePath}`);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    return { message: `${imported.length} products imported successfully`, imported };
  }
  async add(data: Partial<Product>) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id:string, data: Partial<Product>) {
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

  async findByQuery(userId: string, queries: Record<string, any>) {
    const where: any = { owner: { id: userId } };

    for (const key in queries) {
      const value = queries[key];
      where[key] = ILike(`%${value}%`);
    }

    return this.productRepo.find({ where });
  }

}
