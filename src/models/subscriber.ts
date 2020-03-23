import mongoose from 'mongoose';
import { SubscriberType } from '../types/subscribe';

const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

export const Subscriber = mongoose.model<SubscriberType>(
    'Subscriber',
    SubscriberSchema
);
