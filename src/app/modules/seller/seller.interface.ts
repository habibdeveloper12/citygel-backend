import mongoose, { Date, Model, Schema } from 'mongoose';

export type ISeller = {
  _id: mongoose.Types.ObjectId;
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  code?: number;
  firstVerify: boolean;
  terms: boolean;
  marketing: boolean;
  role?: string;
  profileImage?: string;
  ads?: Schema.Types.ObjectId[];
  membership: Schema.Types.ObjectId;
  membershipExpiration: Date;
};
export type SellerModel = {
  isUserExist(email: string): Promise<Pick<ISeller, 'email' | 'role'>>;
} & Model<ISeller>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
