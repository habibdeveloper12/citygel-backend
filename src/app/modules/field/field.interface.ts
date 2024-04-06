import { Model, Schema } from 'mongoose';

export type IField = {
  name: string;
  parameter: string;
  subcategory: Schema.Types.ObjectId;
  type: 'text' | 'textarea' | 'select' | 'number';
  label?: string;
  options?: string[];
};
export type FieldModel = {
  isUserExist(name: string): Promise<Pick<IField, 'name'>>;
} & Model<IField>;

// export type IStudentFilters = {
//   searchTerm?: string;
//   id?: string;
//   bloodGroup?: string;
//   email?: string;
//   contactNo?: string;
//   emergencyContactNo?: string;
// };
