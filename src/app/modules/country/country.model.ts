import { Schema, model } from 'mongoose';
import { CountryModel, ICountry } from './category.interface';

export const categorySchema = new Schema<ICountry, CountryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory', // Reference to Subcategory model
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
categorySchema.statics.isAddExist = async function (
  name: string
): Promise<ICountry | null> {
  return await Country.findOne({ name: name }, { name: 1, subcategories: 1 });
};
export const Country = model<ICountry, CountryModel>('Country', categorySchema);
