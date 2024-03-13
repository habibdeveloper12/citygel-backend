import { Model } from 'mongoose';

export type ISeller = {
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
