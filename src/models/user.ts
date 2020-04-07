import mongoose from 'mongoose';
import { UserInterface } from '../types/user';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Client', 'Manager', 'Admin']
    }
});

UserSchema.set('toJSON', {
    virtuals: true
});

export const User = mongoose.model<UserInterface>('User', UserSchema);
