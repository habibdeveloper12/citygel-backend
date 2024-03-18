/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Seller } from '../seller/seller.model';
import { IMembership } from './membership.interface';
import { Membership } from './membership.model';

const getAllMemberships = async (): Promise<IMembership[]> => {
  const allMembership = Membership.find({});
  return allMembership;
};
const createMembership = async (
  membership: IMembership
): Promise<IMembership | null> => {
  console.log(membership);
  const { name, price, description, maxAdsLimit } = membership;
  let newMembership = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate student id

    // set custom id into both  student & user

    const userMembership = {
      name,
      price,
      description,
      maxAdsLimit,
    };
    const updateMembership = await Membership.create([userMembership], {
      session,
    });

    if (!updateMembership.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Membership');
    }
    newMembership = updateMembership[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  return newMembership;
};

const getSingleMembership = async (
  name: string
): Promise<IMembership | null> => {
  const result = await Membership.findOne({ name: name });
  return result;
};

const updateMembership = async (
  name: string,
  payload: Partial<IMembership>
): Promise<IMembership | null> => {
  const isExist = await Membership.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership not found !');
  }

  const { ...MembershipData } = payload;

  const updatedMembershipData: Partial<IMembership> = { ...MembershipData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IMembership>; // `name.fisrtName`
  //     (updatedMembershipData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IMembership>; // `guardian.fisrtguardian`
  //     (updatedMembershipData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IMembership>; // `localGuardian.fisrtName`
  //     (updatedMembershipData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await Membership.findOneAndUpdate(
    { name: name },
    updatedMembershipData,
    {
      new: true,
    }
  );
  return result;
};

const deleteMembership = async (name: string): Promise<IMembership | null> => {
  // check if the Membership is exist
  const isExist = await Membership.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Membership first
    const subcategory = await Membership.findOneAndDelete(
      { name: name },
      { session }
    );
    if (!subcategory) {
      throw new ApiError(404, 'Failed to delete Membership');
    }
    await Seller.updateMany(
      { membership: isExist._id },
      { $push: { membership: isExist._id } }
    );
    session.commitTransaction();
    session.endSession();

    return subcategory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const MembershipService = {
  getAllMemberships,
  createMembership,
  getSingleMembership,
  updateMembership,
  deleteMembership,
};
