import { Document } from 'mongoose';

export interface AvailableDateType extends Document {
    id: string;
    serviceId: string;
    onModel: string;
    date: string;
    isReserved: boolean;
    reservedUserId?: string;
}

export interface AvailableDateRequestBody {
    serviceId: string;
    serviceType: string;
    dateChunks: string[];
}
