import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Support{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    
}