import mongoose, { Model, Schema } from 'mongoose';

export type ICountry = {
  _id: mongoose.Types.ObjectId;
  name: string;
  city?: String[];
  state?: Schema.Types.ObjectId[];
  countryCode:string
};
export type CountryModel = {
  isUserExist(name: string): Promise<Pick<ICountry, 'name'>>;
} & Model<ICountry>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
