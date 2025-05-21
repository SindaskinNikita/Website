import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Facility {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column()
    name: string = ''

    @Column()
    address: string = ''

    @Column()
    staff_count: number = 0

    @Column()
    status: string = ''
}
