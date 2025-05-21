export interface Setting {
    id: number;
    name: string;
    description: string;
    value: string | boolean;
    category: 'system' | 'notification' | 'security' | 'appearance';
}