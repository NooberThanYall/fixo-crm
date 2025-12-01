import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UserService } from 'src/user/user.service';
import { PromptBuilder } from './prompt/prompt-builder';
import { TaskParser } from './parser/task-parser';
import { ProductService } from 'src/product/product.service';
import { ModelClient } from './model/model-client';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreviewModule } from 'src/preview/preview.module';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    PromptBuilder,
    TaskParser,
    ModelClient 
  ],
  imports: [
    ProductModule,   
    PreviewModule,    
    UserModule,          
    TypeOrmModule.forFeature([]), 
  ],
  exports: [AiService]
})
export class AiModule {}
