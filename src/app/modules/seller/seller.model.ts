import { Schema, model } from 'mongoose';
import { ISeller, SellerModel } from './seller.interface';

export const SellerSchema = new Schema<ISeller, SellerModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'seller',
    },
    terms: {
      type: Boolean,
      default: false,
    },
    firstVerify: {
      type: Boolean,
      default: false,
    },
    marketing: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
    membership: {
      type: Schema.Types.ObjectId,
      ref: 'Membership',
    },
    ads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ads',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
SellerSchema.statics.isUserExist = async function (
  email: string
): Promise<ISeller | null> {
  return await Seller.findOne({ email: email }, { email: 1, role: 1 });
};
export const Seller = model<ISeller, SellerModel>('Seller', SellerSchema);
