import { Document } from 'mongoose';

export interface SubscriberType extends Document {
    id: string;
    email: string;
}

export interface SubscribeJWTPayload {
    id: string;
}
