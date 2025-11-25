import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity'

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   verified: Boolean;

   @Column({ unique: true })
   email: string;

   @Column({ unique: true })
   phone: string;

   @Column()
   password: string;

   @Column({ nullable: true })
   fullName?: string;

   @Column({type: 'jsonb', nullable: true})
   fields: string[];

   @OneToMany(() => Product, (product) => product.owner)
   products: Product[];
}
