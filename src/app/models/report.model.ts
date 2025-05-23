export interface Report {
    id: number;
    title: string;
    type: 'financial' | 'operational' | 'maintenance';
    date: Date;
    status: 'draft' | 'published';
    author: string;
    content?: string;
}
