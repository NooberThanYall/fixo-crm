import { Module } from '@nestjs/common';
import { ExecutorService } from './executor.service';

@Module({
  providers: [ExecutorService]
})
export class ExecutorModule {}
