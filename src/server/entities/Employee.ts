import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('employee')
export class Employee {
    @PrimaryGeneratedColumn({ 
        name: 'id', 
        type: 'integer'
    })
    id!: number;

    @Column({ 
        name: 'name',
        type: 'varchar',
        nullable: false
    })
    name!: string;

    @Column({ 
        name: 'position',
        type: 'varchar',
        nullable: false
    })
    position!: string;

    @Column({ 
        name: 'email',
        type: 'varchar',
        nullable: false
    })
    email!: string;

    @Column({ 
        name: 'phone',
        type: 'varchar',
        nullable: true
    })
    phone?: string;

    @Column({ 
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at?: Date;
} 