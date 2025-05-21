import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    text!: string

    @Column()
    status!: string
} 