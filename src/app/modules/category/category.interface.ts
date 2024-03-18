import mongoose, { Model, Schema } from 'mongoose';

export type ICategory = {
  _id: mongoose.Types.ObjectId;
  name: string;
  subcategories?: Schema.Types.ObjectId[];
};
export type CategoryModel = {
  isUserExist(name: string): Promise<Pick<ICategory, 'name'>>;
} & Model<ICategory>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
