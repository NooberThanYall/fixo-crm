import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum stats {
   PENDING = 'pending',
   DONE = 'done',
   FAILED = 'failed'
}

@Entity()
export class Command{
   @PrimaryGeneratedColumn('uuid')
   id: string;
   
   @Column()
   command: string;

   @Column()
   status: stats
}