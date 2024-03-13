/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { ISeller } from '../seller/seller.interface';

export type IUser = {
  email: string;
  role: string;
  seller?: Types.ObjectId | ISeller;
  admin?: Types.ObjectId | IAdmin;
};

export type UserModel = {
  isUserExist(email: string): Promise<Pick<IUser, 'email' | 'role'>>;
} & Model<IUser>;
