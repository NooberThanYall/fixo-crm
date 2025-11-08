import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

   // Functionality left for later
   // @Column({ nullable: true })
   // imageUrl?: string;

   @Column({ type: 'jsonb', nullable: true })
   customFields?: Record<string, any>;

   @ManyToOne(() => User, { onDelete: 'CASCADE' })
   owner: User;
}
