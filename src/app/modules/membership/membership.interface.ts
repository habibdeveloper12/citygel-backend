import mongoose, { Model } from 'mongoose';

export type IMembership = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  maxAdsLimit: number;
  seller?: mongoose.Types.ObjectId[];
};
export type MembershipModel = {
  isUserExist(name: string): Promise<Pick<IMembership, 'name'>>;
} & Model<IMembership>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
