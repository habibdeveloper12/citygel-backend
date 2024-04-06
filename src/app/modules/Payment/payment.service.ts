/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Membership } from '../membership/membership.model';
import { Seller } from '../seller/seller.model';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
const stripe = require('stripe')(
  'sk_test_51Ov1cySAeHvI9y2y2Eu0NiB3uDN4uytaaQvW66YNBspmSxwkMhjC0qY8B5YtPnf1FVscbaeUB88aXZBljwj3rS9B00vmLGmshq'
);
const getAllPayments = async (): Promise<IPayment[]> => {
  const allPayment = Payment.find({});
  return allPayment;
};
const createPayment = async (paymentData: any): Promise<IPayment | null> => {
  const { membershipType, amount, email, token, save } = paymentData;

  let newPayment: IPayment | null = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const findUser = await Seller.findOne({ email });
    console.log(membershipType, amount);
    // Check if user exists
    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Create payment with Stripe
    // const charge = await stripe.charges.create({
    //   amount: amount * 100,
    //   currency: 'usd',
    //   description: `Payment for ${membershipType} membership`,
    //   source: token.id,
    // });
    // console.log(charge);

    // Create a new payment document
    const userPayment = {
      paymentType: 'stripe',
      amount: amount.toString(),
      currency: 'usd',
      description: `Payment for ${membershipType} membership`,
      source: token.id,
      save: save || false,
      seller: findUser._id,
    };

    // Insert the payment document into the database
    const createdPayment = await Payment.create([userPayment], { session });

    if (!createdPayment.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Payment');
    }

    newPayment = createdPayment[0];

    // Fetch membership details
    const membershipCheck = await Membership.findOne({ name: membershipType });

    if (!membershipCheck) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Membership type not found');
    }

    // Calculate membership expiration date
    const membershipExpiration = new Date();
    membershipExpiration.setDate(
      membershipExpiration.getDate() + membershipCheck.duration
    );

    // Update user's membership details
    const updatedUser = await Seller.findOneAndUpdate(
      { email },
      {
        membership: membershipCheck._id,
        membershipExpiration,
      },
      { new: true, session }
    );

    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  return newPayment;
};

const getSinglePayment = async (name: string): Promise<IPayment | null> => {
  const result = await Payment.findOne({ name: name });
  return result;
};

const updatePayment = async (
  name: string,
  payload: Partial<IPayment>
): Promise<IPayment | null> => {
  const isExist = await Payment.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found !');
  }

  const { ...PaymentData } = payload;

  const updatedPaymentData: Partial<IPayment> = { ...PaymentData };

  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IPayment>; // `name.fisrtName`
  //     (updatedPaymentData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IPayment>; // `guardian.fisrtguardian`
  //     (updatedPaymentData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IPayment>; // `localGuardian.fisrtName`
  //     (updatedPaymentData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await Payment.findOneAndUpdate(
    { name: name },
    updatedPaymentData,
    {
      new: true,
    }
  );
  return result;
};

const deletePayment = async (name: string): Promise<IPayment | null> => {
  // check if the Payment is exist
  const isExist = await Payment.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Payment first
    const subcategory = await Payment.findOneAndDelete(
      { name: name },
      { session }
    );
    if (!subcategory) {
      throw new ApiError(404, 'Failed to delete Payment');
    }
    await Seller.updateMany(
      { Payment: isExist._id },
      { $push: { Payment: isExist._id } }
    );
    session.commitTransaction();
    session.endSession();

    return subcategory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const paymentService = {
  getAllPayments,
  createPayment,
  getSinglePayment,
  updatePayment,
  deletePayment,
};
