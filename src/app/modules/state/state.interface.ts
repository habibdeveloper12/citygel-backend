import mongoose, { Model, Schema } from 'mongoose';

export type IState = {
  _id: mongoose.Types.ObjectId;
  name: string;
  ads: Schema.Types.ObjectId[];

};
export type StateModel = {
  isUserExist(name: string): Promise<Pick<IState, 'name'>>;
} & Model<IState>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
