import mongoose, { Model, Schema } from 'mongoose';

export type ISubcategory = {
  _id: mongoose.Types.ObjectId;
  name: string;
  category?: Schema.Types.ObjectId;
  ads?: Schema.Types.ObjectId[];
  fields?: Schema.Types.ObjectId[];
};
export type SubcategoryModel = {
  isUserExist(name: string): Promise<Pick<ISubcategory, 'name'>>;
} & Model<ISubcategory>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
