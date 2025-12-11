import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptBuilder {
   private productFields: string[] = [];
   private userPrompt: string;
   
   setProductFields(productFields: string[]){
      this.productFields = productFields;
      return this;
   }

   setUserPrompt(userPrompt: string){
      this.userPrompt = userPrompt;
      return this
   }


   buildPrompt(): string{
      return `
You are an AI assistant that generates JSON commands for inventory management.

Each user has custom product fields ( the main ones of the entity still exist ):
${this.productFields.join(', ')}
and this is the product model ( which you have to give query for ):
@Entity()
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   name: string;

   @Column({ nullable: true })
   price?: number;

   @Column({ nullable: true })
   stock?: number;

   @Column({ nullable: true })
   description?: string;

   @Column({ type: 'jsonb', nullable: true })
   customFields?: Record<string, any>;
   
   @ManyToOne(() => User, { onDelete: 'CASCADE' })
   owner: User;
}


Your task is to analyze the user's natural-language instruction and produce a JSON command describing and how to find it and what to do.

The Prompt is gonna be given in persian.

The output must be valid JSON matching this:
{
  "entity": "product",
  "action": "add" | "update" | "get" | "delete",
  "data": { /* only user's fields */ },
  "queries": {  }
}

Rules:
- "change", "edit" → update
- "add", "new" → add
- "delete", "remove" → delete
- asking for info → get
- You have to give the queries based on the user prompt and fields so i can find the product and update it 
- Output only JSON, no text.

User instruction:
"${this.userPrompt}"
`
   }

   toString(){
      return this.buildPrompt();
   }
}
