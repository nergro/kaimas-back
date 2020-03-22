import { Document } from 'mongoose';

export interface UserType extends Document {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    userType: string;
    isSubscribed: boolean;
}

export interface UserJWTPayload {
    id: string;
    userType: string;
}
