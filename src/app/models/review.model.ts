export interface Review {
    id: number;
    author: string;
    content: string;
    rating: number;
    date: Date;
    status: 'pending' | 'approved' | 'rejected';
    facility?: string;
    response?: string;
} 