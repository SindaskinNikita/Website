import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export type FacilityStatus = 'active' | 'inactive' | 'ready' | 'ready_to_rent' | 'rented';
export type FacilityType = 'Офис' | 'Склад' | 'Производство' | 'Торговля';

@Entity('facility')
export class Facility {
    @PrimaryGeneratedColumn({ name: 'id' })
    id!: number

    @Column({ 
        name: 'name', 
        type: 'varchar',
        nullable: false
    })
    name!: string

    @Column({ 
        name: 'address', 
        type: 'varchar',
        nullable: false
    })
    address!: string

    @Column({ 
        name: 'type', 
        type: 'varchar',
        nullable: false,
        enum: ['Офис', 'Склад', 'Производство', 'Торговля']
    })
    type!: FacilityType

    @Column({ 
        name: 'status', 
        type: 'varchar',
        nullable: false,
        enum: ['active', 'inactive', 'ready', 'ready_to_rent', 'rented'],
        default: 'active'
    })
    status!: FacilityStatus

    @Column({ 
        name: 'cost', 
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0
    })
    cost!: number
} 