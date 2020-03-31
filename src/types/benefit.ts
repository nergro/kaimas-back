import { Document } from 'mongoose';

export interface BenefitType extends Document {
    id: string;
    description: string;
    serviceId: string;
    onModel: string;
}
