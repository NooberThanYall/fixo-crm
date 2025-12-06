import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity'

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ unique: true })
   phone: string;

   @Column({ default: false })
   verified: boolean;

   @Column({ type: "varchar", nullable: true })
   verificationCode?: string | null;

   @Column({ type: "timestamp", nullable: true })
   verificationExpires?: Date | null;


   @Column({ unique: true, nullable: true })
   email: string;

   @Column({nullable: true})
   businessName: string;
   
   @Column({nullable: true})
   businessType: string ;


   @Column({nullable: true})
   password: string;

   @Column({ nullable: true })
   fullName?: string;

   @Column({ type: 'jsonb', nullable: true })
   fields: string[];

   @OneToMany(() => Product, (product) => product.owner)
   products: Product[];
}
