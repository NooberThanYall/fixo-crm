import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity'

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ unique: true })
   email: string;

   @Column()
   password: string;

   @Column({ nullable: true })
   fullName?: string;

   @OneToMany(() => Product, (product) => product.owner)
   products: Product[];
}
