/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { ISubcategory } from './subcategory.interface';
import { Subcategory } from './subcategory.model';

const getAllSubcategorys = async (): Promise<ISubcategory[]> => {
  const allSubcategory = Subcategory.find({}).populate('category');
  return allSubcategory;
};
const createSubcategory = async (
  subcategory: ISubcategory
): Promise<ISubcategory | null> => {
  let newSubcategory: ISubcategory | null = null;
  const { name, category } = subcategory;
  // Find the category by name

  // if (!existingCategory) {
  //   throw new Error('Category not found');
  // }

  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the subcategory
    const createdSubcategory = await Subcategory.create(
      [
        {
          name,
        },
      ],
      { session }
    );

    if (!createdSubcategory || createdSubcategory.length === 0) {
      throw new Error('Failed to create subcategory');
    }

    newSubcategory = createdSubcategory[0];

    // for (const subcategory of createdSubcategory) {
    //   await Category.updateOne(
    //     { _id: existingCategory._id },
    //     { $push: { subcategories: subcategory._id } }
    //   );
    // }

    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    console.error('Error creating subcategory:', error);
    throw error;
  } finally {
    // End the session
    session.endSession();
  }

  return newSubcategory;
};

const getSingleSubcategory = async (
  name: string
): Promise<ISubcategory | null> => {
  const result = await Subcategory.findOne({ name: name });
  return result;
};

const updateSubcategory = async (
  name: string,
  payload: Partial<ISubcategory>
): Promise<ISubcategory | null> => {
  const isExist = await Subcategory.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found !');
  }

  const { ...subcategoryData } = payload;

  const updatedSubcategoryData: Partial<ISubcategory> = { ...subcategoryData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<ISubcategory>; // `name.fisrtName`
  //     (updatedSubcategoryData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<ISubcategory>; // `guardian.fisrtguardian`
  //     (updatedSubcategoryData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<ISubcategory>; // `localGuardian.fisrtName`
  //     (updatedSubcategoryData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await Subcategory.findOneAndUpdate(
    { name },
    updatedSubcategoryData,
    {
      new: true,
    }
  );
  return result;
};

const deleteSubcategory = async (
  name: string
): Promise<ISubcategory | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the subcategory to be deleted
    const subcategory = await Subcategory.findOne({ name });

    if (!subcategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    }

    // Find the category containing the subcategory
    const category = await Category.findOneAndUpdate(
      { subcategories: subcategory._id }, // Filter for categories containing the subcategory
      { $pull: { subcategories: subcategory._id } }, // Remove the subcategory from the category
      { session }
    );

    // if (!category) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Category not found!');
    // }

    // Delete the subcategory
    await subcategory.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return subcategory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const SubcategoryService = {
  getAllSubcategorys,
  createSubcategory,
  getSingleSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
