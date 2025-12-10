import { Injectable } from "@nestjs/common";
import { Task } from "../ai.service";
import { AIResponseSchema } from "../schema/prompt-schema";

@Injectable()
export class TaskParser {
  private raw: string;

  setAIPrompt(raw: string) {
    this.raw = raw.trim();  
    console.log('setAiPromptfnc', this.raw)
  }

  parse(): Task {
    const json = this.parseJSON();
    console.log("json", json)
    const normalized = this.normalize(json);
    console.log("normalized", normalized)
    const validated = this.validate(normalized);    
    console.log("vaidated", validated)

    return validated;
  }

  private parseJSON(){
    try {
      return JSON.parse(this.raw)
    } catch (error) {
      throw new Error('LLM returned invalid JSON.')
    } 
  }

  private normalize(obj: any) {
    const entity = String(obj.entity || "").toLowerCase().trim();
    const action = String(obj.action || "").toLowerCase().trim();

    return {
      ...obj,
      entity,
      action,
    };
  }

  private validate(obj: any): Task {
    const parsed = AIResponseSchema.safeParse(obj);

    if (!parsed.success) {
      throw new Error("Invalid task format: " + parsed.error);
    }

    return parsed.data;
  }
}
