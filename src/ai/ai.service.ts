import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExecutorService } from '../executor/executor.service';
import { AiCommandDto } from './dto/command.dto';
import { UserService } from 'src/user/user.service'; // assuming you have this

import OpenAI from 'openai';
import * as fs from 'fs';
import { AddedProduct, Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { AI_PROMPT } from 'src/common/constants/AIPrompt';
import { DeleteResult } from 'typeorm';
import { PromptBuilder } from './prompt/prompt-builder';
import { ModelClient } from './model/model-client';
import { TaskParser } from './parser/task-parser';

export interface Task {
   entity: "product" | "order" | string;
   action: "add" | "update" | "get" | "delete";
   data: Record<string, any>;
   queries: Partial<Product>;
   error?: string;
}

@Injectable()
export class AiService {
   constructor(
      private readonly promptBuilder: PromptBuilder,
      private readonly userService: UserService,
      private readonly productService: ProductService,
      private readonly taskParser: TaskParser,
      private readonly modelClient: ModelClient
   ) { }

   async promptToTask(userPrompt: string, userId: string, execute: boolean = false) {
      try {
         const user = await this.userService.findById(userId);

         // const userFields = user?.fields || ['name', 'price', 'stock'];

         const productFields = ["nigg"];

         const prompt = this.promptBuilder
            .setProductFields(productFields)
            .setUserPrompt(userPrompt)
            .buildPrompt();


         const aiResponse = await this.modelClient.generate(prompt);



         this.taskParser.setAIPrompt(aiResponse);
         const parsedTask = this.taskParser.parse();


         return parsedTask;
      } catch (err) {
         console.error("promptToTask error:", err);
         throw err;
      }
   }




   async findAndUpdateForPreview(userId: string, task: Task) {
      const { queries, data } = task;

      // find based on queries
      const products = await this.productService.findByQuery(userId, queries);

      // nothing found
      if (!products.length) {
         return {
            preview: [],
            message: "No product matched your query."
         };
      }

      // generate preview without touching the database
      const preview = products.map(product => ({
         before: product,
         after: { ...product, ...data }
      }));

      return { preview };
   }


   // async transcribeAndExecute(filePath: string, userId: string) {
   //    // 1. Transcribe Persian audio
   //    const transcription = await this.openai.audio.transcriptions.create({
   //       file: fs.createReadStream(filePath),
   //       model: 'whisper-1',
   //       language: 'fa', // Persian
   //    });

   //    const text = transcription.text;

   //    // 2. Execute the task from transcription
   //    const result = await this.promptToPreview(text, userId);

   //    // 3. Clean up file
   //    fs.unlinkSync(filePath);

   //    return { text, result };
   // }
}
