import { Document } from 'mongoose';

export type UserType = 'Client' | 'Manager' | 'Admin';
export interface UserInterface extends Document {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    userType: UserType;
}

export interface UserJWTPayload {
    id: string;
    userType: string;
}
