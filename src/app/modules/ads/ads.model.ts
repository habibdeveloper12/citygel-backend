import { Schema, model } from 'mongoose';
import { AdsModel, IAds } from './ads.interface';

export const AdsSchema = new Schema<IAds, AdsModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    type: {
      type: String,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    manufacturingYear: {
      type: Number,
    },
    fuelType: {
      type: String,
    },
    listedBy: {
      type: String,
    },
    transmission: {
      type: String,
    },
    kmDriven: {
      type: String,
    },
    owners: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    enquiryType: {
      type: String,
    },
    mainImage: {
      type: String,
    },
    email: {
      type: String,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    moreImages: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
AdsSchema.statics.isAddExist = async function (
  id: string
): Promise<IAds | null> {
  return await Ads.findOne({ id: id }, { email: 1, role: 1 });
};
export const Ads = model<IAds, AdsModel>('Ads', AdsSchema);
