import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TaskDraft {
   @PrimaryGeneratedColumn('uuid') id: string;
   
   @Column() userId: string;

   @Column({ type: 'text' }) prompt: string;

   @Column({ 
      type: 'enum',
      enum: ['pending', 'parsing', 'preview', 'confirmed', 'queued', 'executing', 'done', 'failed'], 
      default: 'pending' 
   }) status: string;

   @Column({ type: 'jsonb', nullable: true }) parsed?: any;

   @Column({ type: 'jsonb', nullable: true }) preview?: any;

   @Column({ nullable: true }) error?: string;

   @Column({ type: 'int', default: 0 }) attempts: number;

   @Column({ nullable: true }) executedAt?: Date;

   @CreateDateColumn() createdAt: Date;

   @UpdateDateColumn() updatedAt: Date;
}