export interface Equipment {
    id: number;
    name: string;
    type: string;
    facility: string;
    status: 'active' | 'inactive';
    lastMaintenance: Date;
    nextMaintenance: Date;
}
