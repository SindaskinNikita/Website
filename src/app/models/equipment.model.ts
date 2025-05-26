export interface Equipment {
    id: number;
    name: string;
    type: string;
    status: string;
    inventory_number: string;
    location: string;
    last_maintenance_date: Date;
    next_maintenance_date: Date;
    description: string;
    company_id: number;
    purchase_date: Date;
    created_at: Date;
    responsible_person?: string;
}
