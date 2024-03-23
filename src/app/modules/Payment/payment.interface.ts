import mongoose, { Model, Schema } from 'mongoose';

export type IPayment = {
  _id: mongoose.Types.ObjectId;
  paymentType: string;
  amount: string;
  currency: string;
  description: string;
  source: string;
  // membership: Schema.Types.ObjectId;
  membershipType: string;
  save: boolean;
  seller: Schema.Types.ObjectId;
};
export type paymentModel = {
  isUserExist(name: string): Promise<Pick<IPayment, '_id'>>;
} & Model<IPayment>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
