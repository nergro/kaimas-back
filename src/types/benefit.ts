import { Document } from 'mongoose';

export interface BenefitType extends Document {
    id: string;
    descriptionLT: string;
    descriptionEN: string;
}
