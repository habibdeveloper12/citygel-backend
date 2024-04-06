/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { IState } from './state.interface';
import { State } from './state.model';

const getAllStates = async (): Promise<IState[]> => {
  const allState = State.find({}).populate({ path: 'ads', model: 'Ads' });
  return allState;
};
const createState = async (subcategory: IState): Promise<IState | null> => {
  let newState: IState | null = null;
  const { name } = subcategory;
  const myname = name.toLowerCase();
  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the subcategory
    const createdState = await State.create(
      [
        {
          name: myname,
        },
      ],
      { session }
    );

    if (!createdState || createdState.length === 0) {
      throw new Error('Failed to create state');
    }

    newState = createdState[0];

    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    console.error('Error creating state:', error);
    throw error;
  } finally {
    // End the session
    session.endSession();
  }

  return newState;
};

const getSingleState = async (name: string): Promise<IState | null> => {
  const result = await State.findOne({ name: name }).populate({
    path: 'ads',
    model: 'Ads',
  });
  return result;
};

const updateState = async (
  name: string,
  payload: Partial<IState>
): Promise<IState | null> => {
  const isExist = await State.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found !');
  }

  const { ...subcategoryData } = payload;

  const updatedStateData: Partial<IState> = { ...subcategoryData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IState>; // `name.fisrtName`
  //     (updatedStateData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IState>; // `guardian.fisrtguardian`
  //     (updatedStateData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IState>; // `localGuardian.fisrtName`
  //     (updatedStateData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await State.findOneAndUpdate({ name }, updatedStateData, {
    new: true,
  });
  return result;
};

const deleteState = async (name: string): Promise<IState | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the subcategory to be deleted
    const subcategory = await State.findOne({ name });

    if (!subcategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'State not found!');
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

export const StateService = {
  getAllStates,
  createState,
  getSingleState,
  updateState,
  deleteState,
};
