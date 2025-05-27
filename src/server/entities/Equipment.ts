import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Equipment {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    type!: string

    @Column()
    facility!: string

    @Column()
    status!: string

    @Column()
    lastMaintenance!: Date

    @Column()
    nextMaintenance!: Date
} 