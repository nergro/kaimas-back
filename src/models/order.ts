import mongoose from 'mongoose';
import { OrderType } from '../types/order';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Cabin', 'Activity']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reservedDates: [
        {
            type: Schema.Types.ObjectId,
            ref: 'AvailableDate'
        }
    ]
});

OrderSchema.set('toJSON', {
    virtuals: true
});

export const Order = mongoose.model<OrderType>('Order', OrderSchema);
