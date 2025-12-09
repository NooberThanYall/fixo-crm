import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ModelClient {
   private readonly API_KEY = process.env.API_KEY;
   private readonly API_URL = process.env.API_URL;
 
   async generate(prompt: string) {
  try {
    console.log("API URL:", this.API_URL)
    console.log("API KEY:", this.API_KEY ? "FOUND" : "MISSING")

    if (!this.API_URL || !this.API_KEY) {
      return { error: 'Api Key or Url not Found!' }
    }

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

    console.log("AI API response status:", response.status)
    console.log("AI API response data:", response.data)

    const aiMessage = response.data?.choices?.[0]?.message?.content;

    if (!aiMessage) throw new InternalServerErrorException('No message from AI API')

    return aiMessage;

  } catch (err: any) {
    console.error("AI generate error:", err.response?.data || err.message || err);
    throw err;  // propagate error up so caller knows
  }
}



}