import { Document } from 'mongoose';

export interface ReviewType extends Document {
    id: string;
    user: string;
    serviceId: string;
    onModel: string;
    date: string;
    rating: number;
    comment: string;
    recommend: boolean;
}

export interface ReviewRequestBody {
    user: string;
    serviceId: string;
    serviceType: 'Activity' | 'Cabin';
    date: string;
    rating: number;
    comment: string;
    recommend: boolean;
}
