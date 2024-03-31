import { Schema, model } from 'mongoose';
import { IMembership, MembershipModel } from './subscription.interface';

export const membershipSchema = new Schema<IMembership, MembershipModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: { type: Number, required: true },
  month: { type: Boolean },
  // maxAdsLimit: {
  //   type: Number,
  //   required: true,
  // },
  seller: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
    },
  ],
});
membershipSchema.statics.isAddExist = async function (
  name: string
): Promise<IMembership | null> {
  return await Membership.findOne(
    { name: name },
    { name: 1, price: 1, duration: 1 }
  );
};
export const Membership = model<IMembership, MembershipModel>(
  'Membership',
  membershipSchema
);
