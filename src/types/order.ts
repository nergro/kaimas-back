import { Document } from 'mongoose';
import { AvailableDateType } from './availableDate';

export interface OrderType extends Document {
    id: string;
    serviceId: string;
    onModel: string;
    userId: string;
    date: string;
    price: number;
    reservedDates: AvailableDateType[];
}

export interface OrderBody {
    datesIds: string[];
    serviceId: string;
    onModel: string;
    price: number;
    date: string;
}

export interface OrderJWTPayload {
    id: string;
    email: string;
    datesIds: string[];
}
