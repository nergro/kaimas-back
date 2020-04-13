import mongoose from 'mongoose';
import { BenefitType } from '../types/benefit';

const Schema = mongoose.Schema;

const BenefitSchema = new Schema({
    descriptionLT: {
        type: String,
        required: true
    },
    descriptionEN: {
        type: String,
        required: true
    }
});

BenefitSchema.set('toJSON', {
    virtuals: true
});

export const Benefit = mongoose.model<BenefitType>('Benefit', BenefitSchema);
