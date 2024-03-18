import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

export const categorySchema = new Schema<ICategory, CategoryModel>(
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
): Promise<ICategory | null> {
  return await Category.findOne({ name: name }, { name: 1, subcategories: 1 });
};
export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema
);
