import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult } from 'typeorm/browser';

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

   @Index()
   @Column()
   ownerId: string;
   
   @ManyToOne(() => User, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'ownerId' })
   owner: User;
}

export type AddedProduct = Product | DeleteResult | null;

// Functionality left for later
// @Column({ nullable: true })
// imageUrl?: string; 