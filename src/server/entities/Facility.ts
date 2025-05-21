import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Facility {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    address!: string

    @Column()
    type!: string

    @Column()
    status!: string
} 