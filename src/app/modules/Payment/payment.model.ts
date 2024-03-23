import { Schema, model } from 'mongoose';
import { IPayment, paymentModel } from './payment.interface';

export const paymentSchema = new Schema<IPayment, paymentModel>(
  {
    paymentType: {
      type: String,
    },
    amount: {
      type: String,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    description: {
      type: String,
      default: 'usd',
    },
    source: {
      type: String,
    },
    // membership: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Membership',
    // },
    membershipType: {
      type: String,
    },
    save: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
paymentSchema.statics.isAddExist = async function (
  id: string
): Promise<IPayment | null> {
  return await Payment.findOne(
    { _id: id },
    { paymentType: 1, amount: 1, seller: 1, membership: 1 }
  );
};
export const Payment = model<IPayment, paymentModel>('Payment', paymentSchema);
