import { Schema, model } from 'mongoose';
import { ISubcategory, SubcategoryModel } from './subcategory.interface';

export const subcategorySchema = new Schema<ISubcategory, SubcategoryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Reference to Category model
      required: true,
    },
    fields: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Field',
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
subcategorySchema.statics.isAddExist = async function (
  name: string
): Promise<ISubcategory | null> {
  return await Subcategory.findOne({ name: name }, { name: 1, category: 1 });
};
export const Subcategory = model<ISubcategory, SubcategoryModel>(
  'Subcategory',
  subcategorySchema
);
