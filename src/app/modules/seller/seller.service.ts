/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { Ads } from '../ads/ads.model';
import { Validation } from '../auth/velidation.model';
import { generateSellerId } from '../user/user.utils';
import { ISeller } from './seller.interface';
import { Seller } from './seller.model';

// const getAllSellers = async (
//   filters: ISellerFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<ISeller[]>> => {
//   // Extract searchTerm to implement search query
//   const { searchTerm, ...filtersData } = filters;
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);

//   const andConditions = [];
//   // Search needs $or for searching in specified fields
//   if (searchTerm) {
//     andConditions.push({
//       $or: SellerSearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }
//   // Filters needs $and to fullfill all the conditions
//   if (Object.keys(filtersData).length) {
//     andConditions.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   // Dynamic  Sort needs  field to  do sorting
//   const sortConditions: { [key: string]: SortOrder } = {};
//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }
//   const whereConditions =
//     andConditions.length > 0 ? { $and: andConditions } : {};

//   const result = await Seller.find(whereConditions)
//     .populate('academicSemester')
//     .populate('academicDepartment')
//     .populate('academicFaculty')
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);

//   const total = await Seller.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
const getAllSellers = async (): Promise<ISeller[]> => {
  const allSeller = Seller.find({}).populate({
    path: 'ads',
    model: 'Ads',
  });
  return allSeller;
};
const createSeller = async (seller: ISeller): Promise<ISeller | null> => {
  console.log(seller);
  const { email, fullName, phoneNumber, terms, code, marketing } = seller;
  let newSeller = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate student id
    const id = await generateSellerId();
    // set custom id into both  student & user
    seller.id = id;
    console.log(seller);
    const verification = await Validation.findOne({ email, code }).exec();
    if (!verification) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong code you entered');
    }
    const alreadyUser = await Seller.findOne({ email: email });
    if (alreadyUser) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Your Account is already Created'
      );
    }
    const userSeller = {
      id,
      fullName,
      phoneNumber,
      terms: true,
      marketing,
      email,
      firstVerify: true,
    };
    const updateSeller = await Seller.create([userSeller], { session });

    if (!updateSeller.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create seller');
    }
    newSeller = updateSeller[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  return newSeller;
};

const getSingleSeller = async (email: string): Promise<ISeller | null> => {
  const result = await Seller.findOne({ email }).populate({
    path: 'ads',
    model: 'Ads',
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found!');
  }
  return result;
};

const updateSeller = async (
  email: string,
  payload: Partial<ISeller>
): Promise<ISeller | null> => {
  const isExist = await Seller.findOne({ email: email });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !');
  }

  const { fullName, role, ...SellerData } = payload;

  const updatedSellerData: Partial<ISeller> = { fullName, role, ...SellerData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<ISeller>; // `name.fisrtName`
  //     (updatedSellerData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<ISeller>; // `guardian.fisrtguardian`
  //     (updatedSellerData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<ISeller>; // `localGuardian.fisrtName`
  //     (updatedSellerData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await Seller.findOneAndUpdate({ email }, updatedSellerData, {
    new: true,
  });
  return result;
};

const deleteSeller = async (
  email: string,
  newOwnerEmail: string
): Promise<ISeller | null> => {
  // Check if the Seller exists
  const seller = await Seller.findOne({ email });

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find ads associated with the seller
    const ads = await Ads.find({ seller: seller._id });

    // Assign ads to the new owner
    const newOwner = await Seller.findOne({ email: newOwnerEmail });

    if (!newOwner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'New owner not found!');
    }

    await Ads.updateMany({ seller: seller._id }, { seller: newOwner._id });

    // Delete the seller
    await Seller.deleteOne({ email });

    session.commitTransaction();
    session.endSession();

    return seller;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const SellerService = {
  getAllSellers,
  createSeller,
  getSingleSeller,
  updateSeller,
  deleteSeller,
};
