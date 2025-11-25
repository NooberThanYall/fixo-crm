import { Module } from '@nestjs/common';
import { ExecutorService } from './executor.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [ExecutorService],
  imports: [ProductModule]
  
})
export class ExecutorModule {}
