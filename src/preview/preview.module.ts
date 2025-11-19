import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';

@Module({
  providers: [PreviewService]
})
export class PreviewModule {}
