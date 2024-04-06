/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Ads } from '../ads/ads.model';
import { State } from '../state/state.model';
import { ICountry } from './country.interface';
import { Country } from './country.model';

const getAllCountrys = async (): Promise<ICountry[]> => {
  const allCountry = await Country.find({}).populate({
    path: 'state',
    model: 'State',
  });
  return allCountry;
};
const createCountry = async (country: ICountry): Promise<ICountry | null> => {
  let newCountry: ICountry | null = null;
  country.name = country.name.toLowerCase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const options = { session };
    const createdCountry = await Country.create([country], options);
    if (!createdCountry || createdCountry.length === 0) {
      throw new Error('Failed to create country');
    }
    newCountry = createdCountry[0];
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating country:', error);
  } finally {
    session.endSession();
  }

  return newCountry;
};

const getSingleCountry = async (name: string): Promise<ICountry | null> => {
  const result = await Country.findOne({ name: name }).populate({
    path: 'state',
    model: 'State',
  });
  console.log('country', name);
  return result;
};

const updateCountry = async (
  name: string,
  payload: Partial<ICountry>
): Promise<ICountry | null> => {
  const isExist = await Country.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found !');
  }

  const { ...countryData } = payload;

  const updatedCountryData: Partial<ICountry> = { ...countryData };

  const result = await Country.findOneAndUpdate(
    { name: name },
    updatedCountryData,
    {
      new: true,
    }
  );
  return result;
};
const updateState = async (
  name: string,
  payload: Partial<ICountry>
): Promise<ICountry | null> => {
  const isExist = await Country.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found !');
  }

  const { state } = payload;
  const stateObj = await State.findOne({ name: state });

  const result = await Country.findOneAndUpdate(
    { name: name },
    { $push: { state: stateObj?._id } },
    { new: true }
  );
  return result;
};
const deleteState = async (
  name: string,
  payload: Partial<ICountry>
): Promise<ICountry | null> => {
  const isExist = await Country.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found !');
  }

  const { state } = payload;
  const stateObj = await State.findOne({ name: state });

  const result = await Country.findOneAndUpdate(
    { name: name },
    { $pull: { state: stateObj?._id } },
    { new: true }
  );
  return result;
};

const deleteCountry = async (name: string): Promise<ICountry | any> => {
  // check if the Ads is exist
  const isExist = await Country.findOne({ name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'country not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Ads first
    const country = await Ads.findOne({ country: name }, { session });
    if (country) {
      throw new ApiError(404, 'Please delete all ads in this country');
    }
    //delete user
    await Country.deleteOne({ name });
    session.commitTransaction();
    session.endSession();

    // return country;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const CountryService = {
  getAllCountrys,
  createCountry,
  deleteState,
  getSingleCountry,
  updateState,
  updateCountry,
  deleteCountry,
};
