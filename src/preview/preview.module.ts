import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [PreviewService],
  imports: [ProductModule],
  exports: [PreviewService]
})
export class PreviewModule {}
