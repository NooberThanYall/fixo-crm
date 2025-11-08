import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {

   private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
   private readonly API_KEY = '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';

   async promptToService(userPrompt: string) {

      const prompt = ``;
      const res = await axios.post(
         this.API_URL,
         {
            model: 'x-ai/grok-4-fast:free',
            messages: [{ role: 'user', content: prompt }],
         },
         {
            headers: {
               Authorization: `Bearer ${this.API_KEY}`,
               'Content-Type': 'application/json',
            },
         },
      );


   }

}



