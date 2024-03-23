import { Category } from '../category/category.model';
import { Subcategory } from '../subcategory/subcategory.model';

export const getCategoryObjectId = async (name: string) => {
  try {
    const category = await Category.findOne({ name: name });
    return category ? category._id : null;
  } catch (error) {
    console.error('Error finding category:', error);
    return null;
  }
};
export const getSubCategoryObjectId = async (name: string) => {
  try {
    const subcategory = await Subcategory.findOne({ name: name });
    return subcategory ? subcategory._id : null;
  } catch (error) {
    console.error('Error finding category:', error);
    return null;
  }
};
