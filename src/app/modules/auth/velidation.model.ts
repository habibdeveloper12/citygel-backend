import { Document, Schema, model } from 'mongoose';

interface IValidation extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

const validationSchema = new Schema<IValidation>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires after 2 minutes
});

export const Validation = model<IValidation>('Validation', validationSchema);
