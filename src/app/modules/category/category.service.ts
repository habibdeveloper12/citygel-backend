/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IAds } from '../ads/ads.interface';
import { Ads } from '../ads/ads.model';
import { Category } from '../category/category.model';
import { ICategory } from './category.interface';

const getAllCategorys = async (): Promise<ICategory[]> => {
  const allCategories = await Category.find({}).populate({
    path: 'subcategories',
    model: 'Subcategory',
  });
  return allCategories;
};
const createCategory = async (
  category: ICategory
): Promise<ICategory | null> => {
  let newCategory: ICategory | null = null;
  category.name = category.name.toLowerCase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const options = { session };
    const createdCategory = await Category.create([category], options);
    if (!createdCategory || createdCategory.length === 0) {
      throw new Error('Failed to create category');
    }
    newCategory = createdCategory[0];
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating category:', error);
  } finally {
    session.endSession();
  }

  return newCategory;
};

const getSingleCategory = async (name: string): Promise<ICategory | null> => {
  const result = await Category.findOne({ name: name });
  console.log('category', name);
  return result;
};

const updateCategory = async (
  name: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const isExist = await Category.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  const { ...CategoryData } = payload;

  const updatedCategoryData: Partial<ICategory> = { ...CategoryData };

  const result = await Category.findOneAndUpdate(
    { name: name },
    updatedCategoryData,
    {
      new: true,
    }
  );
  return result;
};

const deleteCategory = async (
  name: string
): Promise<ICategory | null | IAds> => {
  // check if the Ads is exist
  const isExist = await Category.findOne({ name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Ads first
    const category = await Ads.findOne({ category: name }, { session });
    if (category) {
      throw new ApiError(404, 'Please delete all ads in this category');
    }
    //delete user
    await Category.deleteOne({ name });
    session.commitTransaction();
    session.endSession();

    return category;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const CategoryService = {
  getAllCategorys,
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
