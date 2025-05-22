export interface Facility {
    id: number;
    name: string;
    address: string;
    type: string;
    status: 'active' | 'inactive' | 'ready' | 'ready_to_rent' | 'rented';
    cost: string;
} 