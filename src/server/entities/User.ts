import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ 
        name: 'id', 
        type: 'integer'
    })
    id!: number;

    @Column({ 
        name: 'username',
        type: 'varchar',
        nullable: false,
        unique: true
    })
    username!: string;

    @Column({ 
        name: 'email',
        type: 'varchar',
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({ 
        name: 'password_hash',
        type: 'varchar',
        nullable: false
    })
    password_hash!: string;

    @Column({ 
        name: 'role',
        type: 'varchar',
        nullable: false,
        default: 'user'
    })
    role!: string;

    @Column({ 
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at?: Date;
} 