import mongoose from 'mongoose';
import { BenefitType } from '../types/benefit';

const Schema = mongoose.Schema;

const BenefitSchema = new Schema({
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
    description: {
        type: String,
        required: true
    }
});

BenefitSchema.set('toJSON', {
    virtuals: true
});

export const Benefit = mongoose.model<BenefitType>('Benefit', BenefitSchema);
