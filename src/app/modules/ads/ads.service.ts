/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import { PaginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { Category } from '../category/category.model';
import { Seller } from '../seller/seller.model';
import { generateAdsId } from '../seller/seller.utils';
import { Subcategory } from '../subcategory/subcategory.model';
import { adsSearchableFields } from './ads.constant';
import { AdsFilterableFields, IAds } from './ads.interface';
import { Ads } from './ads.model';

// const getAllAds = async (
//   filters: IAdsFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<IAds[]>> => {
//   // Extract searchTerm to implement search query
//   const { searchTerm, ...filtersData } = filters;
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);

//   const andConditions = [];
//   // Search needs $or for searching in specified fields
//   if (searchTerm) {
//     andConditions.push({
//       $or: AdsearchableFields.map(field => ({
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

//   const result = await Ads.find(whereConditions)
//     .populate('academicSemester')
//     .populate('academicDepartment')
//     .populate('academicFaculty')
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);

//   const total = await Ads.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
const getAllAds = async (
  filters: AdsFilterableFields,
  paginationOptions: PaginationFields
): Promise<IGenericResponse<IAds[]>> => {
  const {
    searchTerm,
    minPrice,
    maxPrice,
    category,
    subcategory,
    ...filtersData
  } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  if (!category) {
  }
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: adsSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (minPrice !== undefined && maxPrice !== undefined) {
    andConditions.push({
      price: { $gte: minPrice, $lte: maxPrice },
    });
  }

  if (Object.keys(filtersData).length) {
    const fieldConditions = Object.entries(filtersData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );

    andConditions.push(...fieldConditions);
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Ads.find(whereConditions)
    .populate({ path: 'category', match: category ? { name: category } : {} })
    .populate({
      path: 'subcategory',
      match: subcategory ? { name: subcategory } : {},
    })
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Ads.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
  // const allAds = Ads.find({});
  // return allAds;
};

const createAds = async (email: string, ads: IAds): Promise<IAds | null> => {
  const {
    category,
    subcategory,
    type,
    brand,
    model,
    manufacturingYear,
    fuelType,
    mainImage,
    moreImages,
    enquiryType,
    city,
    state,
    country,
    price,
    description,
    title,
    owners,
    kmDriven,
    transmission,
    listedBy,
  } = ads;

  let newAds = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log(ads);
    // generate ad id
    const id = await generateAdsId();
    ads.id = id;

    // Find the seller by email
    const seller = await Seller.findOne({ email: email });
    const category = await Category.findOne({ name: 'electric' });
    const subcategory = await Subcategory.findOne({ name: ads.subcategory });

    if (!seller) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Your Account is not created');
    }
    ads.category = category?._id as any;
    ads.subcategory = subcategory?._id as any;
    ads.email = email;
    ads.seller = seller._id.toString() as any;
    console.log(ads, seller);
    const createdAds = await Ads.create([ads], { session });
    const pushUser = await Seller.findOneAndUpdate(
      { email: email },
      { $push: { ads: createdAds[0]._id } }
    );

    if (!createdAds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Ads');
    }

    newAds = createdAds[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newAds;
};

const getSingleAds = async (id: string): Promise<IAds | null> => {
  const result = await Ads.findOne({ id })
    .populate('category')
    .populate('subcategory')
    .populate('seller');
  return result;
};

const updateAds = async (
  id: string,
  payload: Partial<IAds>
): Promise<IAds | null> => {
  const isExist = await Ads.findOne({ id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ads not found !');
  }

  const { ...AdsData } = payload;

  const updatedAdsData: Partial<IAds> = { ...AdsData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IAds>; // `name.fisrtName`
  //     (updatedAdsData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IAds>; // `guardian.fisrtguardian`
  //     (updatedAdsData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IAds>; // `localGuardian.fisrtName`
  //     (updatedAdsData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await Ads.findOneAndUpdate({ id }, updatedAdsData, {
    new: true,
  });
  return result;
};

const deleteAds = async (email: string, id: string): Promise<void> => {
  // Check if the ad exists
  const isExist = await Ads.findOne({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found!');
  }

  try {
    // Remove the ad reference from the user's ads array
    await Seller.findOneAndUpdate({ email }, { $pull: { ads: id } });

    // Delete the ad
    await Ads.deleteOne({ id });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete ad');
  }
};

export const AdsService = {
  getAllAds,
  createAds,
  getSingleAds,
  updateAds,
  deleteAds,
};
