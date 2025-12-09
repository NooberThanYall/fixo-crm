import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ModelClient {
   private readonly API_KEY = process.env.API_KEY;
   private readonly API_URL = process.env.API_URL;
 
   async generate(prompt: string) {
      console.log(this.API_URL, this.API_KEY)
      if (!this.API_URL || !this.API_KEY) return { error: 'Api Key or Url not Found!' }

      const response = await axios.post(
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


      const aiMessage = response.data?.choices?.[0]?.message?.content;
      
      if(!aiMessage) throw new InternalServerErrorException()

      return aiMessage;


   }


}