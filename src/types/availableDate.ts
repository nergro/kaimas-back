import { Document } from 'mongoose';

export interface AvailableDateType extends Document {
    id: string;
    serviceId: string;
    date: string;
}
