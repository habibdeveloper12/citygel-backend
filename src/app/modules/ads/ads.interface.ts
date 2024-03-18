import mongoose, { Model, Schema } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { ISeller } from '../seller/seller.interface';
import { ISubcategory } from '../subcategory/subcategory.interface';

export type IAds = {
  _id: mongoose.Types.ObjectId;
  id: string;
  category: Schema.Types.ObjectId | ICategory;
  seller: Schema.Types.ObjectId | ISeller;
  subcategory?: Schema.Types.ObjectId | ISubcategory;
  type?: string;
  brand?: string;
  model?: string;
  manufacturingYear?: number;
  fuelType?: string;
  listedBy?: string;
  transmission?: string;
  kmDriven?: number;
  owners?: number;
  title: string;
  description: string;
  price: number;
  country?: string;
  state?: string;
  city?: string;
  email: string;
  enquiryType?: string;
  mainImg?: string;
  moreImg?: string[];
};
export type AdsModel = {
  isUserExist(email: string): Promise<Pick<IAds, 'id'>>;
} & Model<IAds>;

export interface AdsSearchableFields {
  id?: boolean;
  title?: boolean;
  model?: boolean;
  brand?: boolean;
  type?: boolean;
  description?: boolean;
}

export interface AdsFilterableFields {
  searchTerm?: boolean;
  id?: boolean;
  city?: boolean;
  price?: boolean;
  category?: boolean;
  subcategory?: boolean;
}
